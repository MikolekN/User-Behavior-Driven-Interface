from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared.base_request import BaseRequest


@dataclass
class UpdateSettingsRequest(BaseRequest):
    settings: dict

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(UpdateSettingsRequest, data)
        if error:
            return error

        return None
