from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository
from constants import BANK_ACCOUNT_NUMBER
from helpers import add
from routes.helpers import create_simple_response
from routes.transfer.helpers import validate_loan_data, prevent_unauthorised_account_access
from transfers import Transfer, TransferRepository
from users import User, UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def create_loan_transfer() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_loan_data(data)
    if error:
        return create_simple_response(error, 400)

    recipient_account = account_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_account:
        return create_simple_response("recipientAccountNotExist", 404)

    if prevent_unauthorised_account_access(recipient_account):
        return create_simple_response("unauthorisedAccountAccess", 403)

    bank_account = account_repository.find_by_account_number(BANK_ACCOUNT_NUMBER)
    if not bank_account:
        return create_simple_response("bankAccountNotExist", 404)

    transfer = Transfer(
                        transfer_from_id=bank_account.id,
                        transfer_to_id=recipient_account.id,
                        title=data['transferTitle'],
                        amount=float(data['amount']))
    transfer_repository.insert(transfer)

    account_repository.update(str(recipient_account.id), {'balance': add(float(recipient_account.balance), float(data['amount']))})

    return create_simple_response("loanCreatedSuccessful", 200)