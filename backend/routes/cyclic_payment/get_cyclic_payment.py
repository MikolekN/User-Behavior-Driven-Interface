from http import HTTPStatus

from flask import Response
from flask_login import login_required

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from cyclic_payments.responses.get_cyclic_payment_response import GetCyclicPaymentResponse
from routes.cyclic_payment.helpers import validate_object_id, prepare_cyclic_payment
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_cyclic_payment(id) -> Response:
    error = validate_object_id(id)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    cyclic_payment: CyclicPayment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(cyclic_payment.issuer_id))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    recipient_account: Account = account_repository.find_by_id(str(cyclic_payment.recipient_id))
    if not recipient_account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    if not recipient_user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    return GetCyclicPaymentResponse.create_response("cyclicPaymentGetSuccessful", prepare_cyclic_payment(cyclic_payment), HTTPStatus.OK)