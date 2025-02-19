from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from request_dto import BaseRequestDto


@dataclass
class MonthlyAnalysisRequestDto(BaseRequestDto):
    year: str

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(MonthlyAnalysisRequestDto, data)
        if error:
            return error

        return None