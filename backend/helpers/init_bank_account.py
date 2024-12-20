from datetime import datetime

from constants import BANK_ACCOUNT_NUMBER
from users import UserRepository, User


def init_bank_account() -> User | None:

    bank = UserRepository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if bank:
        return None
    
    user = User(
        login='bank',
        email='bank@bank.pl',
        password=None,
        created=datetime.now(),
        account_name='BankName',
        account_number='00000000000000000000000000',
        blockades=0,
        balance=0,
        currency='PLN',
        user_icon=None,
        role='BANK')
    
    user = UserRepository.insert(user)