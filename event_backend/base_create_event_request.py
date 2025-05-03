from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional, Type

import bson
from shared import BaseRequest


event_types = ['click_event', 'hover_event', 'page_transition_event', 'form_submit_event']

@dataclass
class BaseCreateEventRequest(BaseRequest):
    start_timestamp: str
    event_type: str
    page: str

    @staticmethod
    def _validate_request(dto_class: Type["BaseRequest"], data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(dto_class, data)
        if error:
            return error

        try:
            data['start_timestamp'] = datetime.fromisoformat(data['start_timestamp'])
        except Exception:
            return "Wrong start timestamp data"

        if data['event_type'] not in event_types:
            return "Wrong event type"

        return None
