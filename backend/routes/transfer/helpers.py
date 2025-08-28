from datetime import datetime
from typing import Any, Callable

from bson import ObjectId
from flask_login import current_user

from accounts import Account, AccountRepository
from constants import MONTHS_IN_YEAR
from transfers import Transfer, TransferRepository
from users import UserRepository

months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


def prevent_unauthorised_account_access(sender_account: Account) -> bool:
    return not (str(sender_account.user) == str(current_user.get_id()))


def serialize_transfers(transfers: list[Transfer], account: Account) -> list[dict[str, Any]]:
    return [serialize_transfer(transfer, account) for transfer in transfers]


def serialize_transfer(transfer: Transfer, account: Account) -> dict[str, Any]:
    transfer_dict = transfer.to_dict()

    is_income = transfer.recipient_account_number == account.number
    transfer_dict['income'] = is_income

    transfer_to_account = account_repository.find_by_account_number_full(transfer.recipient_account_number)
    transfer_to_user = user_repository.find_by_id_full(str(transfer_to_account.user))

    transfer_from_account = account_repository.find_by_account_number_full(transfer.sender_account_number)
    if transfer_from_account.user:
        transfer_from_user = user_repository.find_by_id_full(str(transfer_from_account.user))
        transfer_dict['issuer_name'] = transfer_to_user.login if is_income else transfer_from_user.login
    else:
        transfer_dict['issuer_name'] = transfer_to_user.login

    return sanitize_transfer_dict(transfer_dict)


def sanitize_transfer_dict(transfer: dict) -> dict[str, any]:
    return {key: str(value) if isinstance(value, ObjectId) else value for key, value in transfer.items()}


def format_transfers_date(transfers: list[dict], date_func: Callable[[datetime], str]) -> list[dict]:
    for t in transfers:
        t['created'] = date_func(datetime.fromisoformat(t['created']))
    return transfers


def accumulate_transactions_income_and_outcome(transfers: list[dict]) -> dict[str, any]:
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


def get_response_monthly(transfers: dict, start_month: int, end_month: int) -> list[
    dict[str, str | Any] | dict[str, int | str | Any]]:
    response = []

    limited_months = months[start_month:end_month + 1]

    for idx, m in enumerate(limited_months):
        if str(idx + start_month) in transfers:
            response.append({
                'interval': months[idx + start_month],
                'income': transfers[str(idx + start_month)]['income'],
                'outcome': transfers[str(idx + start_month)]['outcome']
            })
        else:
            response.append({
                'interval': months[idx + start_month],
                'income': 0,
                'outcome': 0
            })

    return response


def get_month_from_datetime(date: datetime) -> str:
    return str(date.month)


def get_year_from_datetime(date: datetime) -> str:
    return str(date.year)


def format_grouped_transfers(grouped: dict) -> dict[str, any]:
    for key in grouped:
        grouped[key] = {
            'income': round(grouped[key]['income'], 2),
            'outcome': round(grouped[key]['outcome'], 2)
        }

    return grouped


def get_response_yearly(transfers: dict) -> list[dict[str, any]]:
    response = []

    for key, item in transfers.items():
        response.append({
            'interval': key,
            'income': item['income'],
            'outcome': item['outcome']
        })

    return response


def set_missing_years(response: list[dict], start_year: int, end_year: int) -> list[dict]:
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


def get_start_month(data: dict) -> int:
    return int(data['start_month'])


def get_end_month(start_month: int, limit: int) -> int:
    return min(start_month + limit - 1, MONTHS_IN_YEAR)


def get_months_range(data: dict) -> tuple[datetime, datetime]:
    year = data['year']
    limit = data['limit']

    start_month = get_start_month(data)
    end_month = get_end_month(start_month, limit)

    start_date = datetime(year=year, month=start_month, day=1)
    if end_month == MONTHS_IN_YEAR:
        end_date = datetime(year=year + 1, month=1, day=1)
    else:
        end_date = datetime(year=year, month=end_month + 1, day=1)

    return (start_date, end_date)


def prepare_monthly_analysis_query(start_date: datetime, end_date: datetime, account: Account) -> dict:
    query = {
        '$or': [
            {'sender_account_number': account.number},
            {'recipient_account_number': account.number}
        ],
        'created': {
            '$gte': start_date,
            '$lt': end_date
        }
    }

    return query


def prepare_yearly_analysis_query(data: dict, account: Account) -> dict:
    query = {
        '$or': [
            {'sender_account_number': account.number},
            {'recipient_account_number': account.number}
        ],
        'created': {
            '$gte': datetime.fromisoformat(f"{data['start_year']}-12-31T23:59:59"),
            '$lt': datetime.fromisoformat(f"{data['end_year']}-12-31T23:59:59")
        }
    }

    return query
