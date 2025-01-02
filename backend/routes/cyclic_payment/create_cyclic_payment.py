from datetime import datetime

from flask import Response, request
from flask_login import login_required, current_user

from cyclic_payments import CyclicPayment, CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from helpers import add
from routes.cyclic_payment.helpers import validate_cyclic_payment_data
from routes.helpers import create_simple_response
from users import UserRepository


user_repository = UserRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def create_cyclic_payment() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_cyclic_payment_data(data)
    if error:
        return create_simple_response(error, 400)

    recipient_user = user_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_user:
        return create_simple_response("userWithAccountNumberNotExist", 404)

    curr_user = user_repository.find_by_id(current_user._id)
    if curr_user.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("userDontHaveEnoughMoney", 403)

    cyclic_payment = CyclicPayment(
        created=datetime.now(),
        issuer_id=curr_user.id,
        recipient_id=recipient_user.id,
        recipient_account_number=data['recipientAccountNumber'],
        recipient_name=recipient_user.login,
        cyclic_payment_name=data['cyclicPaymentName'], transfer_title=data['transferTitle'],
        amount=float(data['amount']), start_date=datetime.fromisoformat(data['startDate']),
        interval=data['interval'])
    cyclic_payment = cyclic_payment_repository.insert(cyclic_payment)

    user_repository.update(curr_user.id, {'blockades': add(float(curr_user.blockades), float(data['amount']))})

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(cyclic_payment)

    return CyclicPaymentResponse.create_response("cyclicPaymentCreatedSuccessful", cyclic_payment_dto.to_dict(), 200)