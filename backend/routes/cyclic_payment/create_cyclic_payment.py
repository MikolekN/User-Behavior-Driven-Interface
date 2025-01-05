from datetime import datetime

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPayment, CyclicPaymentRepository
from cyclic_payments.cyclic_payment_dto import CyclicPaymentDto
from cyclic_payments.cyclic_payment_response import CyclicPaymentResponse
from helpers import add
from routes.cyclic_payment.helpers import validate_cyclic_payment_data
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def create_cyclic_payment() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_cyclic_payment_data(data)
    if error:
        return create_simple_response(error, 400)

    user: User = user_repository.find_by_id(current_user._id)
    if not user:
        return create_simple_response("userNotExist", 404)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", 404)

    recipient_account = account_repository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_account:
        return create_simple_response("accountNotExist", 404)

    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    if not recipient_user:
        return create_simple_response("userNotExist", 404)

    if account.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("accountDontHaveEnoughMoney", 403)

    cyclic_payment = CyclicPayment(
        issuer_id=account.id,
        recipient_id=recipient_account.id,
        cyclic_payment_name=data['cyclicPaymentName'],
        transfer_title=data['transferTitle'],
        amount=float(data['amount']),
        start_date=datetime.fromisoformat(data['startDate']),
        interval=data['interval'])
    cyclic_payment = cyclic_payment_repository.insert(cyclic_payment)

    account_repository.update(account.id, {'blockades': add(float(account.blockades), float(data['amount']))})

    cyclic_payment_dto = CyclicPaymentDto.from_cyclic_payment(cyclic_payment, recipient_account.account_number, recipient_user.login)

    return CyclicPaymentResponse.create_response("cyclicPaymentCreatedSuccessful", cyclic_payment_dto.to_dict(), 200)