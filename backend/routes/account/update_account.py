from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from accounts.requests.update_account_request import UpdateAccountRequest
from accounts.responses.update_account_response import UpdateAccountResponse
from routes.helpers import create_simple_response

account_repository = AccountRepository()


@login_required
def update_account(account_number) -> Response:
    if not isinstance(account_number, str) or len(account_number) != 26 or not account_number.isdigit():
        return create_simple_response("invalidAccountNumber", HTTPStatus.BAD_REQUEST)

    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if not (str(account.user) == str(current_user.get_id())):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    data = request.get_json()

    error = UpdateAccountRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    account_repository.update(str(account.id), data)
    updated_account = account_repository.find_by_id(str(account.id))
    return UpdateAccountResponse.create_response("accountUpdateSuccessful", updated_account.to_dict(), HTTPStatus.OK)
