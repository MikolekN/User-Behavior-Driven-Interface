from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()


@login_required
def set_active_account(account_number: str) -> Response:
    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    user.active_account = account.id
    user_repository.update(user.id, {'active_account': account.id})

    return create_simple_response("activeAccountSetSuccessful", HTTPStatus.OK)