from collections.abc import Mapping
# TODO: czy to musi być mapping z collections a nie np. z typing?
from datetime import datetime
from typing import Optional, Any, Callable

from bson import ObjectId
from flask_login import current_user

from accounts import Account, AccountRepository
from constants import MIN_LOAN_VALUE, MAX_LOAN_VALUE
from transfers import Transfer, TransferRepository
from users import UserRepository

months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


def validate_data(
        data: Mapping[str, Any],
        required_fields: list[str],
        amount_check: bool = False,
        min_value: float = 0,
        max_value: float = float('inf'),
        multiple_of: float = 1
) -> Optional[str]:
    if not data:
        return "emptyRequestPayload"

    for field in required_fields:
        if field not in data:
            return f"{field}Required"

    if amount_check:
        try:
            amount = float(data['amount'])
        except (ValueError, TypeError):
            return "invalidAmount"

        if amount <= 0:
            return "negativeAmount"

        if amount < min_value:
            return f"amountTooSmall;{min_value}"

        if amount > max_value:
            return f"amountTooBig;{max_value}"

        if amount % multiple_of != 0:
            return "invalidAmountFormat"

    return None


def validate_transfer_data(data: Mapping[str, Any]) -> Optional[str]:
    return validate_data(
        data,
        ['senderAccountNumber', 'recipientAccountNumber', 'transferTitle', 'amount'],
        amount_check=True)


def validate_loan_data(data: Mapping[str, Any]) -> Optional[str]:
    return validate_data(
        data,
        ['recipientAccountNumber', 'transferTitle', 'amount'],
        amount_check=True,
        min_value=MIN_LOAN_VALUE,
        max_value=MAX_LOAN_VALUE,
        multiple_of=1000)


def prevent_self_transfer(data: Mapping[str, Any]) -> bool:
    return data['recipientAccountNumber'] == data['senderAccountNumber']


def prevent_unauthorised_account_access(sender_account: Account) -> bool:
    a = sender_account.user
    b = current_user._id
    return not (str(sender_account.user) == str(current_user._id))


def serialize_transfers(transfers: list[Transfer], account: Account) -> list[dict[str, Any]]:
    return [serialize_transfer(transfer, account) for transfer in transfers]


def serialize_transfer(transfer: Transfer, account: Account) -> dict[str, Any]:
    transfer_dict = transfer.to_dict()

    is_income = transfer.transfer_to_id == account.id
    transfer_dict['income'] = is_income

    transfer_from_account = account_repository.find_by_id(str(transfer.transfer_from_id))
    transfer_from_user = user_repository.find_by_id(transfer_from_account.user)
    transfer_to_account = account_repository.find_by_id(str(transfer.transfer_to_id))
    transfer_to_user = user_repository.find_by_id(transfer_to_account.user)
    transfer_dict['issuer_name'] = transfer_to_user.login if is_income else transfer_from_user.login

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


def get_response_monthly(transfers: dict) -> list[dict[str, str | Any] | dict[str, int | str | Any]]:
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
