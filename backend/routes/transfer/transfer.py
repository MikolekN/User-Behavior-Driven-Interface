from flask import Response, request
from flask_login import login_required

from accounts import AccountRepository
from helpers import add, subtract
from routes.helpers import create_simple_response
from routes.transfer.helpers import validate_transfer_data, prevent_self_transfer, prevent_unauthorised_account_access
from transfers import Transfer, TransferRepository


account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def create_transfer() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_transfer_data(data)
    if error:
        return create_simple_response(error, 400)

    if prevent_self_transfer(data):
        return create_simple_response("cannotTransferToSelf", 400)

    sender_account = account_repository.find_by_account_number(data['senderAccountNumber'])
    if not sender_account:
        return create_simple_response("senderAccountNotExist", 404)

    recipient_account = account_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_account:
        return create_simple_response("recipientAccountNotExist", 404)

    if prevent_unauthorised_account_access(sender_account):
        return create_simple_response("unauthorisedAccountAccess", 403)

    if sender_account.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("accountDontHaveEnoughMoney", 403)

    transfer = Transfer(
        transfer_from_id=sender_account.id,
        transfer_to_id=recipient_account.id,
        title=data['transferTitle'],
        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    account_repository.update(str(sender_account.id), {'balance': subtract(float(sender_account.balance), float(data['amount']))})
    account_repository.update(str(recipient_account.id), {'balance': add(float(recipient_account.balance), float(data['amount']))})

    return create_simple_response("transferCreatedSuccessful", 200)