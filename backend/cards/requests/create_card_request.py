from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from accounts.account import account_types
from request_dto import BaseRequestDto


@dataclass
class CreateCardRequest(BaseRequestDto):
    name: str
    holder_name: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(CreateCardRequest, data)
        if error:
            return error

        return None