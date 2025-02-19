from bson import ObjectId

from accounts import AccountRepository, Account
from cyclic_payments import CyclicPayment
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()

def validate_object_id(oid: str) -> str | None:
    if not ObjectId.is_valid(oid):
        return "invalidObjectId"
    return None

def prepare_cyclic_payment(cyclic_payment: CyclicPayment) -> dict:
    response_cyclic_payment = cyclic_payment.to_dict()

    recipient_account: Account = account_repository.find_by_id_full(str(cyclic_payment.recipient_id))
    if not recipient_account:
        return response_cyclic_payment

    response_cyclic_payment['recipient_account_number'] = str(recipient_account.number)

    recipient_user: User = user_repository.find_by_id_full(str(recipient_account.user))
    if not recipient_user:
        return response_cyclic_payment

    response_cyclic_payment['recipient_name'] = recipient_user.login

    return response_cyclic_payment
