from flask import Response, request
from flask_login import login_required, current_user

from cyclic_payments import CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from helpers import add, subtract
from routes.cyclic_payment.helpers import validate_update_cyclic_payment
from routes.helpers import create_simple_response
from users import UserRepository

user_repository = UserRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def update_cyclic_payment(id) -> tuple[Response, int]:
    data = request.get_json()

    error = validate_update_cyclic_payment(data, id)
    if error:
        return create_simple_response(error, 400)

    recipient_user = user_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_user:
        return create_simple_response("userWithAccountNumberNotExist", 404)

    cyclic_payment = cyclic_payment_repository.find_by_id(str(id))
    if not cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", 404)

    curr_user = user_repository.find_by_id(current_user._id)
    if curr_user.get_available_funds() + float(cyclic_payment.amount) - float(data['amount']) < 0:
        return create_simple_response("userDontHaveEnoughMoney", 403)

    user_repository.update(curr_user.id, {'blockades': add(subtract(float(curr_user.blockades), float(cyclic_payment.amount)), float(data["amount"]))})

    cyclic_payment_content = {
        "recipient_id": recipient_user.id,
        "amount": float(data['amount']),
        "cyclic_payment_name": data['cyclicPaymentName'],
        "interval": data['interval'],
        "recipient_account_number": data['recipientAccountNumber'],
        "recipient_name": recipient_user.login,
        "start_date": data['startDate'],
        "transfer_title": data['transferTitle']
    }

    updated_cyclic_payment = cyclic_payment_repository.update(str(id), cyclic_payment_content)
    if not updated_cyclic_payment:
        return create_simple_response("cyclicPaymentNotExist", 404)

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(updated_cyclic_payment)

    return CyclicPaymentResponse.create_response("cyclicPaymentUpdatedSuccessful", cyclic_payment_dto.to_dict(), 200)