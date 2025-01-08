from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from accounts.account_dto import AccountDto
from accounts.account_response import AccountResponse
from routes.helpers import create_simple_response
from users import User, UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()

@login_required
def get_active_account() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    account_dto = AccountDto.from_account(account)
    return AccountResponse.create_response("accountFetchSuccessful", account_dto.to_dict(), HTTPStatus.OK)