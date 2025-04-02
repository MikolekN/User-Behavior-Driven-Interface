from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from base_create_event_request import BaseCreateEventRequest


@dataclass
class CreatePageTransitionEventRequest(BaseCreateEventRequest):
    next_page: str
    time_spent: int

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseCreateEventRequest._validate_request(CreatePageTransitionEventRequest, data)
        if error:
            return error

        return None
