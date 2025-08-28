from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from cards import Card, CardRepository
from cards.requests.create_card_request import CreateCardRequest
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
card_repository = CardRepository()


@login_required
def create_card() -> Response:
    data = request.get_json()

    error = CreateCardRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotFound", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotFound", HTTPStatus.NOT_FOUND)

    card: Card = Card(
        name=data["name"],
        holder_name=data["holder_name"],
        account=account.id,
        number=Card.generate_card_number(),
        valid_thru=Card.generate_card_valid_thru()
    )
    card_repository.insert(card)

    return create_simple_response("cardCreatedSuccessfully", HTTPStatus.CREATED)
