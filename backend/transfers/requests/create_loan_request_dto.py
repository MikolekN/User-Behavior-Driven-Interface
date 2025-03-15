from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared import BaseRequest

from constants import MAX_LOAN_VALUE, MIN_LOAN_VALUE


@dataclass
class CreateLoanRequest(BaseRequest):
    title: str
    amount: int

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(CreateLoanRequest, data)
        if error:
            return error

        if data['amount'] <= 0:
            return "negativeAmount"

        if data['amount'] < MIN_LOAN_VALUE:
            return f"amountTooSmall;{MIN_LOAN_VALUE}"

        if data['amount'] > MAX_LOAN_VALUE:
            return f"amountTooBig;{MAX_LOAN_VALUE}"

        if data['amount'] % 1000 != 0:
            return "invalidAmountFormat"

        return None