from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from cards import CardRepository, Card
from cards.responses.get_card_response import GetCardResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
card_repository = CardRepository()

@login_required
def get_card(card_number:str ) -> Response:
    if not isinstance(card_number, str) or len(card_number) != 16 or not card_number.isdigit():
        return create_simple_response("invalidCardNumber", HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.NOT_FOUND)

    card: Card = card_repository.find_by_card_number(card_number)
    if not card:
        return create_simple_response("cardNotExist", HTTPStatus.NOT_FOUND)

    if not (str(user.active_account) == str(card.account)):
        return create_simple_response("unauthorisedCardAccess", HTTPStatus.UNAUTHORIZED)

    return GetCardResponse.create_response("cardFetchSuccessful", card.to_dict(), HTTPStatus.OK)