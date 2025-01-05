from flask import Response
from flask_login import login_required, current_user

from cyclic_payments import CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.user_cyclic_payments_response import UserCyclicPaymentsResponse
from routes.helpers import create_simple_response

cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_all_user_cyclic_payment() -> tuple[Response, int]:
    query = {
        'issuer_id': current_user._id
    }
    sort_criteria = [("created", -1)]
    cyclic_payments = cyclic_payment_repository.find_cyclic_payments(query, sort_criteria)
    if not cyclic_payments:
        return create_simple_response("cyclicPaymentListEmpty", 404)

    cyclic_payments = [CyclicPaymentDto.from_cyclic_payment(cyclic_payment).to_dict() for cyclic_payment in cyclic_payments]

    return UserCyclicPaymentsResponse.create_response("cyclicPaymentListGetSuccessful", cyclic_payments, 200)