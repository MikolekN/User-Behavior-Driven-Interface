from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared import BaseRequest


@dataclass
class UpdateCardRequest(BaseRequest):
    name: str
    holder_name: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(UpdateCardRequest, data)
        if error:
            return error

        return None
