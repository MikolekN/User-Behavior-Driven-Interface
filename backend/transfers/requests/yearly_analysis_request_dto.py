from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from shared import BaseRequest


@dataclass
class YearlyAnalysisRequest(BaseRequest):
    start_year: int
    end_year: int

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequest._validate_request(YearlyAnalysisRequest, data)
        if error:
            return error

        return None