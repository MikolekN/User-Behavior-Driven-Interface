from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from base_create_event_request import BaseCreateEventRequest


@dataclass
class CreateClickEventRequest(BaseCreateEventRequest):
    element_id: str
    from_dropdown: bool

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseCreateEventRequest._validate_request(CreateClickEventRequest, data)
        if error:
            return error

        return None
