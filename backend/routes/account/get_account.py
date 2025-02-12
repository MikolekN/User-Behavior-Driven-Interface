from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from accounts.responses.get_account_response import GetAccountResponse
from routes.helpers import create_simple_response

account_repository = AccountRepository()

@login_required
def get_account(account_number) -> Response:
    if not isinstance(account_number, str) or len(account_number) != 26 or not account_number.isdigit():
        return create_simple_response("invalidAccountNumber", HTTPStatus.BAD_REQUEST)

    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if not (str(account.user) == str(current_user.get_id())):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    return GetAccountResponse.create_response("accountFetchSuccessful", account.to_dict(), HTTPStatus.OK)