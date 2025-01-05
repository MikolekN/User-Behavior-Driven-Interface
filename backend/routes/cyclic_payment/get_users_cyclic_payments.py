from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.user_cyclic_payments_response import UserCyclicPaymentsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_all_user_cyclic_payment() -> tuple[Response, int]:
    user: User = user_repository.find_by_id(current_user._id)
    if not user:
        return create_simple_response("userNotExist", 404)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", 404)

    query = {
        'issuer_id': account.id
    }
    sort_criteria = [("created", -1)]
    cyclic_payments: list[CyclicPayment] = cyclic_payment_repository.find_cyclic_payments(query, sort_criteria)
    if not cyclic_payments:
        return create_simple_response("cyclicPaymentListEmpty", 404)

    cyclic_payment_dtos: list[dict] = [get_cyclic_payment_dto(cyclic_payment).to_dict() for cyclic_payment in cyclic_payments]

    return UserCyclicPaymentsResponse.create_response("cyclicPaymentListGetSuccessful", cyclic_payment_dtos, 200)

def get_cyclic_payment_dto(cyclic_payment: CyclicPayment) -> CyclicPaymentDto:
    recipient_account: Account = account_repository.find_by_id(str(cyclic_payment.recipient_id))
    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    return CyclicPaymentDto.from_cyclic_payment(cyclic_payment, recipient_account.account_number, recipient_user.login)