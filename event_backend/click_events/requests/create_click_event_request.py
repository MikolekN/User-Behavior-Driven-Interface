from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

import bson
from shared import BaseRequest


@dataclass
class CreateClickEventRequest(BaseRequest):
    start_timestamp: str
    event_type: str
    page: str
    element_id: str
    from_dropdown: bool

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(CreateClickEventRequest, data)
        if error:
            return error

        try:
            data['start_timestamp'] = datetime.fromisoformat(data['start_timestamp'])
        except Exception:
            return "Wrong start timestamp data"

        if data['event_type'] != "click_event":
            return "Wrong event type"

        return None