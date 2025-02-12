from datetime import datetime

from accounts import AccountRepository, Account
from constants import BANK_ACCOUNT_NUMBER
from users import UserRepository, User


def init_bank_account() -> Account | None:
    account_repository = AccountRepository()
    bank = account_repository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if bank:
        return None

    account: Account = Account(
        name='BankName',
        number=BANK_ACCOUNT_NUMBER,
        type='BANK',
        blockades=0,
        balance=0,
        currency='PLN',
        user=None
    )

    return account_repository.insert(account)
