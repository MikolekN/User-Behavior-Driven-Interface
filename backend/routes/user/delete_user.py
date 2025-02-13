from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user, logout_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from users import UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()

@login_required
def delete_user() -> Response:
    user = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    accounts: list[Account] = account_repository.find_accounts(str(user.id))
    for account in accounts:
        account_repository.delete(str(account.id))

    user_repository.delete(current_user.get_id())
    logout_user()
    return create_simple_response("userDeleteSuccessful", HTTPStatus.OK)