from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from request_dto import BaseRequestDto


@dataclass
class RegisterRequest(BaseRequestDto):
    email: str
    password: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(RegisterRequest, data)
        if error:
            return error

        return None