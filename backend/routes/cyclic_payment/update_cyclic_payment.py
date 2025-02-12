from datetime import datetime
from http import HTTPStatus

from flask import Response, request
from flask_login import login_required

from accounts import Account, AccountRepository
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from cyclic_payments.requests.update_cyclic_payment_request import UpdateCyclicPaymentRequest
from cyclic_payments.responses.update_cyclic_payment_response import UpdateCyclicPaymentResponse
from helpers import add
from routes.cyclic_payment.helpers import validate_object_id
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def update_cyclic_payment(id) -> Response:
    message = validate_object_id(id)
    if message:
        return create_simple_response(message, HTTPStatus.BAD_REQUEST)

    data = request.get_json()

    error = UpdateCyclicPaymentRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    recipient_account: Account = account_repository.find_by_account_number(data['recipient_account_number'])
    if not recipient_account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    if not recipient_user:
        return create_simple_response("userWithAccountNumberNotExist", HTTPStatus.NOT_FOUND)

    cyclic_payment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", HTTPStatus.NOT_FOUND)

    issuer_account: Account = account_repository.find_by_id(cyclic_payment.issuer_id)
    if not issuer_account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(issuer_account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.BAD_REQUEST)

    if issuer_account.get_available_funds() + float(cyclic_payment.amount) - float(data['amount']) < 0:
        return create_simple_response("userDontHaveEnoughMoney", HTTPStatus.BAD_REQUEST)

    account_repository.update(issuer_account.id, {'blockades': add(float(issuer_account.blockades), float(cyclic_payment.amount))})

    data = {
        "issuer_id": issuer_account.id,
        "recipient_id": recipient_account.id,
        "cyclic_payment_name": data['cyclic_payment_name'],
        "transfer_title": data['transfer_title'],
        "amount": float(data['amount']),
        "start_date": datetime.fromisoformat(data['start_date']),
        "interval": data['interval']
    }
    updated_cyclic_payment = cyclic_payment_repository.update(str(id), data)
    if not updated_cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", HTTPStatus.NOT_FOUND)

    return UpdateCyclicPaymentResponse.create_response("cyclicPaymentUpdatedSuccessful", updated_cyclic_payment.to_dict(), HTTPStatus.OK)
