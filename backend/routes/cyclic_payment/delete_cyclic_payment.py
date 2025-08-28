from http import HTTPStatus

from flask import Response
from flask_login import login_required

from accounts import Account, AccountRepository
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from helpers import subtract
from routes.cyclic_payment.helpers import validate_object_id
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()


@login_required
def delete_cyclic_payment(id) -> Response:
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

    account_repository.update(str(account.id),
                              {'blockades': subtract(float(account.blockades), float(cyclic_payment.amount))})

    cyclic_payment_repository.delete(str(id))

    return create_simple_response("cyclicPaymentDeletedSuccessful", HTTPStatus.OK)
