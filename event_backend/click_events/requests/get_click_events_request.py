from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

import bson
from shared import BaseRequest


@dataclass
class GetClickEventsRequest(BaseRequest):
    user_id: str
    token: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(GetClickEventsRequest, data)
        if error:
            return error

        if not isinstance(data['user_id'], str) or not bson.ObjectId.is_valid(data['user_id']):
            return "invalidUser"
        data['user_id'] = bson.ObjectId(data['user_id'])

        return None