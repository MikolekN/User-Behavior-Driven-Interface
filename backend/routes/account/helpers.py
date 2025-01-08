from typing import Any, Optional

from accounts.account import account_types
from accounts.account_dto import AccountDto


def validate_account_data(data: dict[str, Any]) -> Optional[str]:
    if not data:
        return "emptyRequestPayload"

    if not isinstance(data, dict):
        return "invalidRequestPayload"

    required_fields: list[dict[str, Any]] = [
        {
            "field_name": field_name,
            "field_type": field_type,
            "field_value": data.get(field_name)
        }
        for field_name, field_type in AccountDto.__annotations__.items()
        if field_name not in {"account_number", "balance", "blockades"}
    ]

    missing_fields = [field["field_name"] for field in required_fields if field["field_value"] is None]
    if missing_fields:
        return f"missingFields;{','.join(missing_fields)}"

    allowed_field_names = {field["field_name"] for field in required_fields}
    extra_fields = [field for field in data if field not in allowed_field_names]
    if extra_fields:
        return f"extraFields;{','.join(extra_fields)}"

    invalid_type_fields = []
    empty_fields = []

    for field in required_fields:
        if not isinstance(field["field_value"], field["field_type"]):
            invalid_type_fields.append(field["field_name"])

        if isinstance(field["field_value"], str) and not field["field_value"].strip():
            empty_fields.append(field["field_name"])

    if invalid_type_fields:
        return f"invalidTypeFields;{','.join(invalid_type_fields)}"
    if empty_fields:
        return f"emptyFields;{','.join(empty_fields)}"

    currency_field = next(field for field in required_fields if field["field_name"] == "currency")
    currency = currency_field["field_value"]
    if len(currency) != 3 or not currency.isupper():
        return "currencyInvalidFormat"

    type_field = next(field for field in required_fields if field["field_name"] == "type")
    if type_field["field_value"] not in account_types:
        return "accountTypeInvalid"

    return None
