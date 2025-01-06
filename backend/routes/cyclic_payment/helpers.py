from collections.abc import Mapping
from datetime import datetime
from typing import Any, Optional

from bson import ObjectId

from cyclic_payments import CyclicPayment


def validate_cyclic_payment_data(data: Optional[Mapping[str, Any]]) -> Optional[str]:
    # TODO: lepsza walidacja na typy i zawartość np.
    # - amount jak nie jest liczbą wywala backend, bez podania przyczyny
    # - name i interval mogą być puste
    if not data:
        return "emptyRequestPayload"

    message = validate_required_cyclic_payment_fields(data)
    if message:
        return message

    amount = float(data.get('amount'))
    if amount <= 0:
        return "negativeAmount"

    try:
        start_date = data.get('start_date')
        datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    except (TypeError, ValueError):
        return "invalidDateFormat"

    return None


def validate_required_cyclic_payment_fields(data: Mapping[str, Any]) -> str | None:
    required_fields = [
        'cyclic_payment_name',
        'recipientAccountNumber',
        'transfer_title',
        'amount',
        'start_date',
        'interval']
    field_names = ""
    for field in required_fields:
        if field not in data:
            field_names += field + " "

    if field_names:
        return f"missingFields;{field_names.strip()}"

    return None


def validate_object_id(oid: str) -> str | None:
    if not ObjectId.is_valid(oid):
        return "invalidObjectId"
    return None


def validate_update_cyclic_payment(data: Mapping[str, Any] | None, id: str) -> str | None:
    if not data:
        return "emptyRequestPayload"

    message = validate_object_id(id)
    if message:
        return message

    message = validate_required_cyclic_payment_fields(data)
    if message:
        return message

    return None
