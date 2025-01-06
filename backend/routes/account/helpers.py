import random

from accounts.account import account_types


def validate_create_account_data(data) -> str | None:
    if not data.get('account_name'):
        return "accountNameRequired"
    if not data.get('account_type'):
        return "accountTypeRequired"
    if data.get('account_type') not in account_types:
        return "accountTypeInvalid"
    if not data.get('currency'):
        return "currencyRequired"

def generate_account_number() -> str:
    return ''.join(random.choices('0123456789', k=26))