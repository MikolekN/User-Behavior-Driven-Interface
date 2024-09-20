from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_required
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users.user_repository import UserRepository
from transfers.transfer_repository import TransferRepository
from transfers.transfer import Transfer
from bson import ObjectId

months = ['', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']

transfer_blueprint = Blueprint('transfer', __name__, url_prefix='/api')

def validate_transfer_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if 'recipentAccountNumber' not in data or 'transferTitle' not in data or 'amount' not in data:
        return "All fields are required"
    return None

def validate_get_all_user_transfers_yearly(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if not all(key in data for key in ['startYear', 'endYear']):
        return "Start Year and End Year are required"
    if ('startYear' in data and not isinstance(data['startYear'], int)) or ('endYear' in data and not isinstance(data['endYear'], int)):
        return "Start year and / or end year has to be of type integer"
    return None

def validate_get_all_user_transfers_monthly(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if 'year' not in data:
        return "Year must be provided"
    if 'year' in data and not isinstance(data['year'], int):
        return "Year has to be of type integer"
    return None

def sanitize_transfer_dict(transfer: dict) -> dict[str, any]:
    serialized_transfer = {}
    for key, value in transfer.items():
        if isinstance(value, ObjectId):
            serialized_transfer[key] = str(value)
        else:
            serialized_transfer[key] = value
    return serialized_transfer

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

def serialize_transfer_dict(transfer: dict) -> dict[str, any]:
    transfer = set_income_flag(transfer)
    transfer = sanitize_transfer_dict(transfer)
    return transfer

def serialize_transfers(transfers: dict) -> dict[str, any]:
    serialized_transfers = []

    for t in transfers:
        serialized_transfers.append(serialize_transfer_dict(t))

    return serialized_transfers

def format_transfers_date(transfers, func):
    for t in transfers:
        t['created'] = func(datetime.fromisoformat(t['created']))
    
    return transfers

def group_by_date(transfers: dict) -> dict[str, any]:
    groups = {}

    for t in transfers:
        date = t['created']
        if date not in groups:
            groups[date] = {
                'income': 0,
                'outcome': 0
            }
        if t.get('income', False):
            groups[date]['income'] += t['amount']
        else:
            groups[date]['outcome'] += t['amount']

    return groups

def format_grouped_transfers(grouped: dict) -> dict[str, any]: # może tutaj też się obyć bez kopii
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

def get_response_yearly(transfers: dict) -> dict[str, any]:
    response = []

    for key, item in transfers.items():
        response.append({
            'interval': key,
            'income': item['income'],
            'outcome': item['outcome']
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
    formatted_transfers = format_transfers_date(transfers, get_month_from_date)
    grouped_transfers = format_grouped_transfers(group_by_date(formatted_transfers))
    response = get_response_monthly(grouped_transfers)
    return response

def get_transfers_analysis_yearly(transfers: dict) -> dict[str, any]:
    formatted_transfers = format_transfers_date(transfers, get_year_from_date)
    grouped_transfers = format_grouped_transfers(group_by_date(formatted_transfers))
    response = get_response_yearly(grouped_transfers)
    return response

def get_month_from_date(date: datetime) -> str:
    return str(date.month)

def get_year_from_date(date: datetime) -> str:
    return str(date.year)

def substract(a: float, b: float) -> float:
    return float(((a * 100) - (b * 100)) / 100)

def add(a: float, b: float) -> float:
    return float(((a * 100) + (b * 100)) / 100)

@transfer_blueprint.route('/transfer', methods=['POST'])
@login_required
def make_transfer() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_transfer_data(data)

    if error:
        return jsonify(message=error), 400
    
    recipent_user = UserRepository.find_by_account_number(data['recipentAccountNumber'])
    
    if not recipent_user:
        return jsonify(message="User with given account number does not exist"), 404
    
    if current_user.get_available_funds() - float(data['amount']) < 0:
        return jsonify(message="User does not have enough money"), 403

    transfer = Transfer(created=datetime.now(), transfer_from_id=current_user._id,
                        transfer_to_id=recipent_user._id, title=data['transferTitle'], amount=float(data['amount']))
    transfer = TransferRepository.insert(transfer)

    UserRepository.update(current_user._id, {'balance': substract(float(current_user.balance), float(data['amount']))})
    UserRepository.update(recipent_user._id, {'balance': add(float(recipent_user.balance), float(data['amount']))})

    return jsonify(message="Transfer made successfully"), 200 # maybe add some response json

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
    serialized_transfers = serialize_transfers(transfers)

    return jsonify(message="Transfers returned successfully", transfers=serialized_transfers), 200

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
    serialized_transfers = serialize_transfers(transfers)
    response = get_transfers_analysis_monthly(serialized_transfers)

    return jsonify(message="Transfers monthly analysis returned successfully", transfers=response), 200

@transfer_blueprint.route('/transfers/analysis/yearly', methods=['POST'])
@login_required
def get_all_user_transfers_yearly() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_get_all_user_transfers_yearly(data)

    if error:
        return jsonify(message=error), 400

    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ]
    }

    if 'startYear' in data:
        start_date = f"{data['startYear']}-01-01T00:00:00"
        query['created'] = {
            '$gte': start_date
        }

    if 'endYear' in data:
        end_date = f"{data['endYear']}-12-31T23:59:59"
        if 'created' in query:
            query['created']['$lt'] = end_date
        else:
            query['created'] = {
                '$lt': end_date
            }

    transfers = TransferRepository.find_transfers(query)
    serialized_transfers = serialize_transfers(transfers)
    response = set_missing_years(get_transfers_analysis_yearly(serialized_transfers), data['startYear'], data['endYear'])

    return jsonify(message="Transfers yaerly analysis returned successfully", transfers=response), 200