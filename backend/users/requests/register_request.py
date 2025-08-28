from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared import BaseRequest


@dataclass
class RegisterRequest(BaseRequest):
    email: str
    password: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(RegisterRequest, data)
        if error:
            return error

        return None
