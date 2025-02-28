from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, Optional

from backend.constants import AVAILABLE_MONTH_LIMITS, MONTHS_IN_YEAR
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
        
        if data['limit'] not in AVAILABLE_MONTH_LIMITS:
            return 'invalidMonthlyAnalysisLimit'
        
        if data['start_month'] > MONTHS_IN_YEAR:
            return 'tooBigStartMonthValue'
        
        if data['start_month'] + data['limit'] - 1 > MONTHS_IN_YEAR:
            return 'startMonthAndLimitExceedsYear'

        return None