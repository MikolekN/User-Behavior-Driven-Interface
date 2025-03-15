from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository
from constants import BANK_ACCOUNT_NUMBER
from helpers import add
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from transfers import Transfer, TransferRepository
from transfers.requests.create_loan_request_dto import CreateLoanRequest
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def create_loan_transfer() -> Response:
    data = request.get_json()

    error = CreateLoanRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.NOT_FOUND)

    recipient_account = account_repository.find_by_id(str(user.active_account))
    if not recipient_account:
        return create_simple_response("recipientAccountNotExist", HTTPStatus.NOT_FOUND)

    # is that necessary after grabbing active account of the user?
    if prevent_unauthorised_account_access(recipient_account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    bank_account = account_repository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if not bank_account:
        return create_simple_response("bankAccountNotExist", HTTPStatus.NOT_FOUND)

    transfer = Transfer(
                        sender_account_number=bank_account.number,
                        recipient_account_number=recipient_account.number,
                        title=data['title'],
                        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    account_repository.update(str(recipient_account.id), {'balance': add(float(recipient_account.balance), float(data['amount']))})

    return create_simple_response("loanCreatedSuccessful", HTTPStatus.OK)