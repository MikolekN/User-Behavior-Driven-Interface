from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from constants import MAX_LOAN_VALUE, MIN_LOAN_VALUE
from request_dto import BaseRequestDto


@dataclass
class CreateLoanRequestDto(BaseRequestDto):
    title: str
    amount: float

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(CreateLoanRequestDto, data)
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