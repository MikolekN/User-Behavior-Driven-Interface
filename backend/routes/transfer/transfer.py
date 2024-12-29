from datetime import datetime

from flask import Response, request
from flask_login import login_required, current_user

from helpers import add, subtract
from routes.helpers import create_simple_response
from routes.transfer.helpers import validate_transfer_data, prevent_self_transfer
from transfers import Transfer, TransferRepository
from users import UserRepository, User

user_repository = UserRepository()
transfer_repository = TransferRepository()


@login_required
def create_transfer() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_transfer_data(data)
    if error:
        return create_simple_response(error, 400)

    if prevent_self_transfer(data):
        return create_simple_response("cannotTransferToSelf", 400)
    # TODO: dodać na frontend odpowiednią wiadomość

    recipient_user = user_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_user:
        return create_simple_response("userWithAccountNumberNotExist", 404)

    user: User = user_repository.find_by_id(current_user._id)
    if user.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("userDontHaveEnoughMoney", 403)

    transfer = Transfer(created=datetime.now(),
                        transfer_from_id=user.id,
                        transfer_to_id=recipient_user.id,
                        title=data['transferTitle'],
                        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    user_repository.update(str(user.id), {'balance': subtract(float(user.balance), float(data['amount']))})
    user_repository.update(str(recipient_user.id), {'balance': add(float(recipient_user.balance), float(data['amount']))})

    return create_simple_response("transferCreatedSuccessful", 200)