from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from accounts.responses.get_accounts_response import GetAccountsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()


@login_required
def get_accounts() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    accounts: list[Account] = account_repository.find_accounts(str(user.id))
    if not accounts:
        return create_simple_response("accountsNotExist", HTTPStatus.NOT_FOUND)

    accounts_dto = [account.to_dict() for account in accounts]

    return GetAccountsResponse.create_response("accountsFetchSuccessful", accounts_dto, HTTPStatus.OK)
