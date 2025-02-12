from collections.abc import Mapping
from typing import Any

from bson import ObjectId


def validate_required_cyclic_payment_fields(data: Mapping[str, Any]) -> str | None:
    required_fields = [
        'cyclic_payment_name',
        'recipient_id',
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
