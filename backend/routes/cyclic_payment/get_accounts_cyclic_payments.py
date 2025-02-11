from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPaymentRepository, CyclicPayment
from cyclic_payments.responses.get_accounts_cyclic_payments_response import GetAccountsCyclicPaymentsResponse
from routes.helpers import create_simple_response
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
cyclic_payment_repository = CyclicPaymentRepository()

@login_required
def get_accounts_cyclic_payments() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    query = {
        'issuer_id': account.id
    }
    sort_criteria = [("created", -1)]
    cyclic_payments: list[CyclicPayment] = cyclic_payment_repository.find_cyclic_payments(query, sort_criteria)
    if not cyclic_payments:
        return create_simple_response("cyclicPaymentListEmpty", HTTPStatus.NOT_FOUND)

    cyclic_payment_dtos: list[dict] = [cyclic_payment.to_dict() for cyclic_payment in cyclic_payments]

    return GetAccountsCyclicPaymentsResponse.create_response("cyclicPaymentListGetSuccessful", cyclic_payment_dtos, HTTPStatus.OK)
