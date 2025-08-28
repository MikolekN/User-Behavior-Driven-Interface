from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository
from cards import Card, CardRepository
from cards.requests.update_card_request import UpdateCardRequest
from cards.responses.update_card_response import UpdateCardResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
card_repository = CardRepository()


@login_required
def update_card(card_number: str) -> Response:
    if not isinstance(card_number, str) or len(card_number) != 16 or not card_number.isdigit():
        return create_simple_response("invalidCardNumber", HTTPStatus.BAD_REQUEST)

    data = request.get_json()

    error = UpdateCardRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.NOT_FOUND)

    card: Card = card_repository.find_by_card_number(card_number)
    if not card:
        return create_simple_response("cardNotExist", HTTPStatus.NOT_FOUND)

    card_repository.update(str(card.id), data)
    updated_card = card_repository.find_by_id(str(card.id))
    return UpdateCardResponse.create_response("cardUpdateSuccessful", updated_card.to_dict(), HTTPStatus.OK)
