from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from cards import Card, CardRepository
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
card_repository = CardRepository()

@login_required
def delete_account(account_number) -> Response:
    if not isinstance(account_number, str) or len(account_number) != 26 or not account_number.isdigit():
        return create_simple_response("invalidAccountNumber", HTTPStatus.BAD_REQUEST)

    account: Account = account_repository.find_by_account_number(account_number)
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if account.user is None:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    user: User = user_repository.find_by_id(str(account.user))
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not (str(account.user) == str(current_user.get_id())):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    if user.active_account and str(user.active_account) == str(account.id):
        user_repository.update(str(user.id), {'active_account': None})

    account_repository.delete(str(account.id))

    cards: list[Card] = card_repository.find_cards(str(account.id))
    if cards:
        for card in cards:
            card_repository.delete(str(card.id))

    return create_simple_response("accountDeleteSuccessful", HTTPStatus.OK)
