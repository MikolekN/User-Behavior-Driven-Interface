from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

from shared import BaseRequest

from base_create_event_request import BaseCreateEventRequest


@dataclass
class CreateHoverEventRequest(BaseCreateEventRequest):
    element_id: str
    end_timestamp: str
    duration: int

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseCreateEventRequest._validate_request(CreateHoverEventRequest, data)
        if error:
            return error

        try:
            data['end_timestamp'] = datetime.fromisoformat(data['end_timestamp'])
        except Exception:
            return "Wrong end timestamp data"

        return None
