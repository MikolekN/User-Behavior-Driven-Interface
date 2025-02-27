from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from request_dto import BaseRequestDto


@dataclass
class MonthlyAnalysisRequestDto(BaseRequestDto):
    year: int
    start_month: int
    limit: int # number of months per request

    @staticmethod
    def validate_request(data: Mapping[str, Any]) -> Optional[str]:
        error = BaseRequestDto._validate_request(MonthlyAnalysisRequestDto, data)
        if error:
            return error
        
        if int(data['limit']) not in [1, 3, 6, 12]:
            return 'invalidMonthlyAnalysisLimit'

        return None