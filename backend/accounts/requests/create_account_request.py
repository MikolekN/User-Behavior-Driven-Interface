from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from accounts.account import account_types
from request_dto import BaseRequestDto


@dataclass
class CreateAccountRequest(BaseRequestDto):
    name: str
    type: str
    currency: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(CreateAccountRequest, data)
        if error:
            return error

        currency = data["currency"]
        if len(currency) != 3 or not currency.isupper():
            return "currencyInvalidFormat"

        type_field = data["type"]
        if type_field not in account_types:
            return "accountTypeInvalid"

        return None