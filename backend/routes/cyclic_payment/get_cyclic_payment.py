from flask import Response
from flask_login import login_required

from cyclic_payments import CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from routes.cyclic_payment.helpers import validate_object_id
from routes.helpers import create_simple_response


cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_cyclic_payment(id) -> tuple[Response, int]:
    error = validate_object_id(id)
    if error:
        return create_simple_response(error, 400)

    cyclic_payment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", 404)

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(cyclic_payment)

    return CyclicPaymentResponse.create_response("cyclicPaymentGetSuccessful", cyclic_payment_dto.to_dict(), 200)