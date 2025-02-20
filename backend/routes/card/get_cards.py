from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from cards import CardRepository, Card
from cards.responses.get_cards_response import GetCardsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
card_repository = CardRepository()

@login_required
def get_cards() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.NOT_FOUND)

    cards: list[Card] = card_repository.find_cards(str(user.active_account))
    if not cards:
        return create_simple_response("cardsNotExist", HTTPStatus.NOT_FOUND)

    cards_dto = [card.to_dict() for card in cards]

    return GetCardsResponse.create_response("cardsFetchSuccessful", cards_dto, HTTPStatus.OK)