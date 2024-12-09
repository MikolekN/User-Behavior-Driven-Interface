from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_required
from datetime import datetime
from collections.abc import Mapping
from typing import Any, Callable
from ..users import UserRepository
from ..transfers import *
from bson import ObjectId
from ..helpers import add, substract
from ..constants import BANK_ACCOUNT_NUMBER, MAX_LOAN_VALUE, MIN_LOAN_VALUE

months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

transfer_blueprint = Blueprint('transfer', __name__, url_prefix='/api')

def validate_transfer_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "emptyRequestPayload"
    
    if 'recipientAccountNumber' not in data or 'transferTitle' not in data or 'amount' not in data:
        return "allFieldsRequired"
    
    amount = float(data.get('amount'))
    if amount <= 0:
        return "negativeAmount"

    return None

def validate_loan_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "emptyRequestPayload"
    
    if 'transferTitle' not in data or 'amount' not in data:
        return "allFieldsRequired"
    
    amount = float(data.get('amount'))
    
    if amount < MIN_LOAN_VALUE:
        return f"amountTooSmall;{MIN_LOAN_VALUE}"
    
    if amount > MAX_LOAN_VALUE:
        return f"amountTooBig;{MAX_LOAN_VALUE}"
    
    if amount % 1000 != 0:
        return "invalidAmountFormat"
    
    return None

def validate_get_all_user_transfers_yearly(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "emptyRequestPayload"
    if not all(key in data for key in ['startYear', 'endYear']):
        return "startEndYearRequired"
    if ('startYear' in data and not isinstance(data['startYear'], int)) or ('endYear' in data and not isinstance(data['endYear'], int)):
        return "invalidStartEndYearType"
    return None

def validate_get_all_user_transfers_monthly(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "emptyRequestPayload"
    if 'year' not in data:
        return "yearNotProvided"
    if 'year' in data and not isinstance(data['year'], int):
        return "yearInvalidType"
    return None

def sanitize_transfer_dict(transfer: dict) -> dict[str, any]:
    sanitized_transfer_dict = {}
    for key, value in transfer.items():
        if isinstance(value, ObjectId):
            sanitized_transfer_dict[key] = str(value)
        else:
            sanitized_transfer_dict[key] = value
    return sanitized_transfer_dict

def set_income_flag(transfer: dict) -> dict[str, any]:
    if 'transfer_from_id' in transfer and transfer['transfer_from_id'] == current_user._id:
        transfer['income'] = False
        issuer = UserRepository.find_by_id(transfer['transfer_to_id'])
        transfer['issuer_name'] = issuer.login # Tutaj uznałem, że może zostać login. Jeszcze powiedz Dawid czy się zgadzasz.

    elif 'transfer_to_id' in transfer and transfer['transfer_to_id'] == current_user._id:
        transfer['income'] = True
        issuer = UserRepository.find_by_id(transfer['transfer_from_id'])
        transfer['issuer_name'] = issuer.login

    return transfer

def serialize_transfer_dict(transfer: Transfer) -> dict[str, any]:
    transfer = set_income_flag(transfer.to_dict())
    transfer = sanitize_transfer_dict(transfer)
    return transfer

def serialize_transfers(transfers: list[Transfer]) -> dict[str, any]:
    serialized_transfers = []

    for t in transfers:
        serialized_transfers.append(serialize_transfer_dict(t))

    return serialized_transfers

def format_transfers_date(transfers: dict[str, any], func: Callable[[datetime], str]) -> dict[str, any]:
    for t in transfers:
        t['created'] = func(datetime.fromisoformat(t['created']))
    
    return transfers

def group_by_date(transfers: dict) -> dict[str, any]:
    grouped_transfers = {}

    for t in transfers:
        date = t['created']
        if date not in grouped_transfers:
            grouped_transfers[date] = []
        grouped_transfers[date].append(t)

    return grouped_transfers

def accumulate_tranactions_income_and_outcome(transfers: dict) -> dict[str, any]:
    accumulated_groups = {}

    for t in transfers:
        date = t['created']
        if date not in accumulated_groups:
            accumulated_groups[date] = {
                'income': 0,
                'outcome': 0
            }
        if t.get('income', False):
            accumulated_groups[date]['income'] += t['amount']
        else:
            accumulated_groups[date]['outcome'] += t['amount']

    return accumulated_groups

def format_grouped_transfers(grouped: dict) -> dict[str, any]:
    for key in grouped:
        grouped[key] = {
            'income': round(grouped[key]['income'], 2),
            'outcome': round(grouped[key]['outcome'], 2)
        }

    return grouped

def get_response_monthly(transfers: dict) -> dict[str, any]:
    response = []
    
    for idx, m in enumerate(months):
        if str(idx) in transfers:
            response.append({
                'interval': months[idx],
                'income': transfers[str(idx)]['income'],
                'outcome': transfers[str(idx)]['outcome']
            })
        else:
            response.append({
                'interval': months[idx],
                'income': 0,
                'outcome': 0 
            })
    
    response = response[1:]
    return response

def get_response_yearly(transfers: dict) -> list[dict[str, any]]:
    response = []

    for key, item in transfers.items():
        response.append({
            'interval': key,
            'income': item['income'],
            'outcome': item['outcome']
        })

    return response

def get_transfers_history_response(transfers: dict) -> list[dict[str, any]]:
    response = []
    
    for date, transactions in transfers.items():
        response.append({
            "date": date,
            "transactions": transactions
        })

    return response

def set_missing_years(response: dict, start_year: int, end_year: int) -> dict[str, any]:
    existing_years = {item['interval'] for item in response}

    for year in range(start_year, end_year + 1):
        if str(year) not in existing_years:
            response.append({
                'interval': str(year),
                'income': 0,
                'outcome': 0
            })
    response.sort(key=lambda x: int(x['interval']))

    return response

def get_transfers_analysis_monthly(transfers: dict) -> dict[str, any]:
    formatted_transfers = format_transfers_date(transfers, get_month_from_datetime)
    acc_grouped_transfers = format_grouped_transfers(accumulate_tranactions_income_and_outcome(formatted_transfers))
    response = get_response_monthly(acc_grouped_transfers)
    return response

def get_transfers_analysis_yearly(transfers: dict) -> dict[str, any]:
    formatted_transfers = format_transfers_date(transfers, get_year_from_datetime)
    acc_grouped_transfers = format_grouped_transfers(accumulate_tranactions_income_and_outcome(formatted_transfers))
    response = get_response_yearly(acc_grouped_transfers)
    return response

def get_transactions_history_response(transfers: dict) -> dict[str, any]:
    formatted_transfers = format_transfers_date(transfers, get_date_from_datetime)
    grouped_transfers = group_by_date(formatted_transfers)
    response = get_transfers_history_response(grouped_transfers)
    return response

def get_month_from_datetime(date: datetime) -> str:
    return str(date.month)

def get_year_from_datetime(date: datetime) -> str:
    return str(date.year)

def get_date_from_datetime(date: datetime) -> str:
    # date in the format like: "09.09.2024"
    return date.strftime('%d.%m.%Y')

@transfer_blueprint.route('/transfer/loan', methods=['POST'])
@login_required
def create_loan_transfer() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_loan_data(data)

    if error:
        return jsonify(message=error), 400
    
    recipient_user = UserRepository.find_by_id(current_user._id)
    if not recipient_user:
        return jsonify(message="userWithAccountNumberNotExist"), 404
    
    bank = UserRepository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if not bank:
        return jsonify(message="bankAccountNotExist"), 404

    transfer = Transfer(created=datetime.now(), transfer_from_id=bank._id,
                        transfer_to_id=recipient_user._id, title=data['transferTitle'], amount=float(data['amount']))
    transfer = TransferRepository.insert(transfer)

    UserRepository.update(current_user._id, {'balance': add(float(current_user.balance), float(data['amount']))})

    return jsonify(message="loanCreatedSuccessful"), 200

@transfer_blueprint.route('/transfer', methods=['POST'])
@login_required
def create_transfer() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_transfer_data(data)

    if error:
        return jsonify(message=error), 400
    
    recipient_user = UserRepository.find_by_account_number(data['recipientAccountNumber'])
    
    if not recipient_user:
        return jsonify(message="userWithAccountNumberNotExist"), 404
    
    curr_user = UserRepository.find_by_id(current_user._id)
    if curr_user.get_available_funds() - float(data['amount']) < 0:
        return jsonify(message="userDontHaveEnoughMoney"), 403

    transfer = Transfer(created=datetime.now(), transfer_from_id=current_user._id,
                        transfer_to_id=recipient_user._id, title=data['transferTitle'], amount=float(data['amount']))
    transfer = TransferRepository.insert(transfer)

    UserRepository.update(curr_user._id, {'balance': substract(float(curr_user.balance), float(data['amount']))})
    UserRepository.update(recipient_user._id, {'balance': add(float(recipient_user.balance), float(data['amount']))})

    return jsonify(message="transferCreatedSuccessful"), 200

@transfer_blueprint.route('/transfers', methods=['GET'])
@login_required
def get_all_user_transfers() -> tuple[Response, int]:
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ]
    }
    sort_criteria = [("created", -1)]
    transfers = TransferRepository.find_transfers(query, sort_criteria)
    if not transfers:
        return jsonify(message="transferListEmpty"), 404
    
    serialized_transfers = serialize_transfers(transfers)
    response = get_transactions_history_response(serialized_transfers)
    
    return jsonify(message="transferListGetSuccessful", transfers=response), 200

@transfer_blueprint.route('/transfers/analysis/monthly', methods=['POST'])
@login_required
def get_all_user_transfers_monthly() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_get_all_user_transfers_monthly(data)

    if error:
        return jsonify(message=error), 400
    
    start_date = f"{data['year']}-01-01T00:00:00"
    end_date = f"{data['year']}-12-31T23:59:59" 
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ],
        'created': {
            '$gte': start_date,
            '$lt': end_date
        }
    }

    transfers = TransferRepository.find_transfers(query)
    if not transfers:
        return jsonify(message="monthlyAnalysisEmpty"), 404

    serialized_transfers = serialize_transfers(transfers)
    response = get_transfers_analysis_monthly(serialized_transfers)

    return jsonify(message="monthlyAnalysisSuccessful", transfers=response), 200

@transfer_blueprint.route('/transfers/analysis/yearly', methods=['POST'])
@login_required
def get_all_user_transfers_yearly() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_get_all_user_transfers_yearly(data)

    if error:
        return jsonify(message=error), 400
    
    start_date = f"{data['startYear']}-01-01T00:00:00"
    end_date = f"{data['endYear']}-12-31T23:59:59"
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ],
        'created': {
            '$gte': start_date,
            '$lt': end_date
        }
    }

    transfers = TransferRepository.find_transfers(query)
    if not transfers:
        return jsonify(message="yearlyAnalysisEmpty"), 404
    
    serialized_transfers = serialize_transfers(transfers)
    response = set_missing_years(get_transfers_analysis_yearly(serialized_transfers), data['startYear'], data['endYear'])

    return jsonify(message="yearlyAnalysisSuccessful", transfers=response), 200
