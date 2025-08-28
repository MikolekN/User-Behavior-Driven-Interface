from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from accounts.requests.create_account_request import CreateAccountRequest
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()


@login_required
def create_account() -> Response:
    data = request.get_json()

    error = CreateAccountRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotFound", HTTPStatus.NOT_FOUND)

    account = Account(
        name=data['name'],
        type=data['type'],
        currency=data['currency'],
        number=Account.generate_account_number(),
        blockades=0.0,
        balance=0.0,
        user=user.id
    )
    account_repository.insert(account)

    return create_simple_response("accountCreatedSuccessfully", HTTPStatus.CREATED)
