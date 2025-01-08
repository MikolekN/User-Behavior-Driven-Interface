from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from cyclic_payments import CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from helpers import add, subtract
from routes.cyclic_payment.helpers import validate_update_cyclic_payment
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def update_cyclic_payment(id) -> Response:
    data = request.get_json()

    error = validate_update_cyclic_payment(data, id)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    recipient_account: Account = account_repository.find_by_account_number(data['recipientAccountNumber'])
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

    updated_cyclic_payment = cyclic_payment_repository.update(str(id), data)
    if not updated_cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", HTTPStatus.NOT_FOUND)

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(updated_cyclic_payment, recipient_account.account_number, recipient_user.login)

    return CyclicPaymentResponse.create_response("cyclicPaymentUpdatedSuccessful", cyclic_payment_dto.to_dict(), HTTPStatus.OK)
