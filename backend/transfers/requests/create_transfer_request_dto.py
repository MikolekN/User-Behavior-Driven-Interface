from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared import BaseRequest


@dataclass
class CreateTransferRequest(BaseRequest):
    recipient_account_number: str
    title: str
    amount: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(CreateTransferRequest, data)
        if error:
            return error

        if float(data['amount']) <= 0:
            return "negativeAmount"

        return None
