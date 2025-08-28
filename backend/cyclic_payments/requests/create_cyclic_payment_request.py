from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

from shared import BaseRequest


@dataclass
class CreateCyclicPaymentRequest(BaseRequest):
    recipient_account_number: str
    cyclic_payment_name: str
    transfer_title: str
    amount: str
    start_date: str
    interval: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(CreateCyclicPaymentRequest, data)
        if error:
            return error

        if float(data['amount']) <= 0:
            return "negativeAmount"

        try:
            start_date = data.get('start_date')
            datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        except (TypeError, ValueError):
            return "invalidDateFormat"

        return None
