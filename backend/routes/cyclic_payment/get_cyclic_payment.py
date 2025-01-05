from flask import Response
from flask_login import login_required

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from routes.cyclic_payment.helpers import validate_object_id
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_cyclic_payment(id) -> tuple[Response, int]:
    error = validate_object_id(id)
    if error:
        return create_simple_response(error, 400)

    cyclic_payment: CyclicPayment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", 404)

    account: Account = account_repository.find_by_id(str(cyclic_payment.issuer_id))
    if not account:
        return create_simple_response("accountNotExist", 404)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", 403)

    recipient_account: Account = account_repository.find_by_id(str(cyclic_payment.recipient_id))
    if not recipient_account:
        return create_simple_response("accountNotExist", 404)

    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    if not recipient_user:
        return create_simple_response("userNotExist", 404)

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(cyclic_payment, recipient_account.account_number, recipient_user.login)

    return CyclicPaymentResponse.create_response("cyclicPaymentGetSuccessful", cyclic_payment_dto.to_dict(), 200)