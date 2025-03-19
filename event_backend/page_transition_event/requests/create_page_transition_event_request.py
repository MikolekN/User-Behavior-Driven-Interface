from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional

import bson
from shared import BaseRequest

from base_create_event_request import BaseCreateEventRequest


@dataclass
class CreatePageTransitionEventRequest(BaseCreateEventRequest):
    next_page: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseCreateEventRequest._validate_request(CreatePageTransitionEventRequest, data)
        if error:
            return error

        return None
