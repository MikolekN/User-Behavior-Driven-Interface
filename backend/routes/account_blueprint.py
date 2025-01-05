import random

from flask import Blueprint, Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from accounts.account import account_types
from accounts.account_dto import AccountDto
from accounts.account_response import AccountResponse
from accounts.accounts_response import AccountsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

account_blueprint = Blueprint('account', __name__, url_prefix='/api')

user_repository = UserRepository()
account_repository = AccountRepository()

@account_blueprint.route('/accounts/active', methods=['GET'])
@login_required
def get_active_account() -> tuple[Response, int]:
    user: User = user_repository.find_by_id(current_user._id)
    account: Account = account_repository.find_by_id(str(user.active_account))

    if not account:
        return create_simple_response("accountNotExist", 404)

    account_dto = AccountDto.from_account(account)
    return AccountResponse.create_response("accountFetchSuccessful", account_dto.to_dict(), 200)

@account_blueprint.route('/accounts/<account_number>', methods=['GET'])
@login_required
def get_account(account_number) -> tuple[Response, int]:
    account: Account = account_repository.find_by_account_number(account_number)

    if not account:
        return create_simple_response("accountNotExist", 404)

    account_dto = AccountDto.from_account(account)
    return AccountResponse.create_response("accountFetchSuccessful", account_dto.to_dict(), 200)

@account_blueprint.route('/accounts/', methods=['GET'])
@login_required
def get_accounts() -> tuple[Response, int]:
    user: User = user_repository.find_by_id(current_user._id)
    accounts: list[Account] = account_repository.find_accounts(str(user.id))

    if not accounts:
        return create_simple_response("accountsNotExist", 404)

    accounts_dto = [account.to_dict() for account in accounts]

    return AccountsResponse.create_response("accountsFetchSuccessful", accounts_dto, 200)

@account_blueprint.route('/accounts/set_active/<account_number>', methods=['PUT'])
@login_required
def set_active_account(account_number: str) -> tuple[Response, int]:
    user: User = user_repository.find_by_id(current_user._id)
    account: Account = account_repository.find_by_account_number(account_number)

    if not account:
        return create_simple_response("accountNotExist", 404)

    user.active_account = account.id
    user_repository.update(user.id, {'active_account': account.id})

    return create_simple_response("activeAccountSetSuccessful", 200)

@account_blueprint.route('/accounts/', methods=['POST'])
@login_required
def create_account() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_create_account_data(data)
    if error:
        return create_simple_response(error, 400)

    user: User = user_repository.find_by_id(current_user._id)
    account: Account = Account(
        account_name=data['account_name'],
        account_number=generate_account_number(),
        type=data['accountType'],
        blockades=0,
        balance=0,
        currency=data['currency'],
        user=user.id
    )
    account_repository.insert(account)

    return create_simple_response("accountCreatedSuccessfully", 201)

def validate_create_account_data(data) -> str | None:
    if not data.get('account_name'):
        return "accountNameRequired"
    if not data.get('accountType'):
        return "accountTypeRequired"
    if data.get('accountType') not in account_types:
        return "accountTypeInvalid"
    if not data.get('currency'):
        return "currencyRequired"

def generate_account_number() -> str:
    return ''.join(random.choices('0123456789', k=26))
