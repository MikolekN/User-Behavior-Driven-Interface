from http import HTTPStatus

from flask import Response, request
from flask_login import login_required

from accounts import AccountRepository
from helpers import add, subtract
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_self_transfer, prevent_unauthorised_account_access
from transfers import Transfer, TransferRepository
from transfers.requests.create_transfer_request_dto import CreateTransferRequestDto

account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def create_transfer() -> Response:
    data = request.get_json()

    error = CreateTransferRequestDto.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if prevent_self_transfer(data):
        return create_simple_response("cannotTransferToSelf", HTTPStatus.BAD_REQUEST)

    sender_account = account_repository.find_by_account_number(data['sender_account_number'])
    if not sender_account:
        return create_simple_response("senderAccountNotExist", HTTPStatus.NOT_FOUND)

    recipient_account = account_repository.find_by_account_number(data['recipient_account_number'])
    if not recipient_account:
        return create_simple_response("recipientAccountNotExist", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(sender_account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    if sender_account.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("accountDontHaveEnoughMoney", HTTPStatus.BAD_REQUEST)

    transfer = Transfer(
        sender_account_number=sender_account.number,
        recipient_account_number=recipient_account.number,
        title=data['title'],
        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    account_repository.update(str(sender_account.id), {'balance': subtract(float(sender_account.balance), float(data['amount']))})
    account_repository.update(str(recipient_account.id), {'balance': add(float(recipient_account.balance), float(data['amount']))})

    return create_simple_response("transferCreatedSuccessful", HTTPStatus.CREATED)