from flask import Response
from flask_login import login_required, current_user

from cyclic_payments import CyclicPaymentRepository
from helpers import subtract
from routes.cyclic_payment.helpers import validate_object_id
from routes.helpers import create_simple_response
from users import UserRepository

user_repository = UserRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def delete_cyclic_payment(id) -> tuple[Response, int]:
    error = validate_object_id(id)
    if error:
        return create_simple_response(error, 400)

    cyclic_payment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", 404)

    curr_user = user_repository.find_by_id(current_user._id)
    user_repository.update(curr_user.id, {'blockades': subtract(float(curr_user.blockades), float(cyclic_payment.amount))})

    cyclic_payment_repository.delete(str(id))

    return create_simple_response("cyclicPaymentDeletedSuccessful", 200)