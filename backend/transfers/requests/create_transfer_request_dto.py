from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from request_dto import BaseRequestDto


@dataclass
class CreateTransferRequestDto(BaseRequestDto):
    sender_account_number: str
    recipient_account_number: str
    title: str
    amount: float

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(CreateTransferRequestDto, data)
        if error:
            return error

        if data['amount'] <= 0:
            return "negativeAmount"

        return None

