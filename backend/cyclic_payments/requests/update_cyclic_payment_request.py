from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from datetime import datetime
from request_dto import BaseRequestDto


@dataclass
class UpdateCyclicPaymentRequest(BaseRequestDto):
    recipient_account_number: str
    cyclic_payment_name: str
    transfer_title: str
    amount: float
    start_date: str
    interval: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(UpdateCyclicPaymentRequest, data)
        if error:
            return error

        if data['amount'] <= 0:
            return "negativeAmount"

        try:
            start_date = data.get('start_date')
            datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        except (TypeError, ValueError):
            return "invalidDateFormat"

        return None