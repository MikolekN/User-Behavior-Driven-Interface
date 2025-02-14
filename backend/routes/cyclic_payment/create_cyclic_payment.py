from datetime import datetime
from http import HTTPStatus

from flask import Response, request
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPayment, CyclicPaymentRepository
from cyclic_payments.requests.create_cyclic_payment_request import CreateCyclicPaymentRequest
from helpers import add
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def create_cyclic_payment() -> Response:
    data = request.get_json()

    error = CreateCyclicPaymentRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    recipient_account = account_repository.find_by_account_number(data['recipient_account_number'])
    if not recipient_account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    recipient_user: User = user_repository.find_by_id(str(recipient_account.user))
    if not recipient_user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if account.get_available_funds() - float(data['amount']) < 0:
        return create_simple_response("accountDontHaveEnoughMoney", HTTPStatus.BAD_REQUEST)

    cyclic_payment = CyclicPayment(
        issuer_id=account.id,
        recipient_id=recipient_account.id,
        cyclic_payment_name=data['cyclic_payment_name'],
        transfer_title=data['transfer_title'],
        amount=float(data['amount']),
        start_date=datetime.fromisoformat(data['start_date']),
        interval=data['interval'])
    cyclic_payment_repository.insert(cyclic_payment)

    account_repository.update(str(account.id), {'blockades': add(float(account.blockades), float(data['amount']))})

    return create_simple_response("cyclicPaymentCreatedSuccessful", HTTPStatus.CREATED)
