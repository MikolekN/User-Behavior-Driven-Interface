from datetime import datetime

from flask import Response, request
from flask_login import login_required, current_user

from constants import BANK_ACCOUNT_NUMBER
from helpers import add
from routes.helpers import create_response
from routes.transfer.helpers import validate_loan_data, prevent_self_transfer
from transfers import Transfer, TransferRepository
from users import UserRepository

user_repository = UserRepository()
transfer_repository = TransferRepository()

@login_required
def create_loan_transfer() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_loan_data(data)
    if error:
        return create_response(error, 400)

    recipient_user = user_repository.find_by_id(current_user._id)
    if not recipient_user:
        return create_response("userWithAccountNumberNotExist", 404)

    bank = user_repository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if not bank:
        return create_response("bankAccountNotExist", 404)

    transfer = Transfer(created=datetime.now(),
                        transfer_from_id=bank.id,
                        transfer_to_id=recipient_user.id,
                        title=data['transferTitle'],
                        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    user_repository.update(recipient_user.id, {'balance': add(float(recipient_user.balance), float(data['amount']))})

    return create_response("loanCreatedSuccessful", 200)