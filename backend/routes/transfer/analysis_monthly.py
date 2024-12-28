from collections.abc import Mapping
from typing import Any, Optional

from flask import Response, request
from flask_login import login_required, current_user

from routes.transfer.helpers import serialize_transfers, \
    format_transfers_date, format_grouped_transfers, get_month_from_datetime, \
    accumulate_transactions_income_and_outcome, get_response_monthly, create_response
from transfers import TransferRepository

transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers_monthly() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_get_all_user_transfers_monthly(data)
    if error:
        return create_response(error, 400)

    year = data['year']
    start_date, end_date = f"{year}-01-01T00:00:00", f"{year}-12-31T23:59:59"
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ],
        'created': {'$gte': start_date, '$lt': end_date}
    }

    transfers = transfer_repository.find_transfers(query)
    if not transfers:
        return create_response("monthlyAnalysisEmpty", 404)

    serialized_transfers = serialize_transfers(transfers)
    response = get_transfers_analysis_monthly(serialized_transfers)

    return create_response("monthlyAnalysisSuccessful", data=response, status_code=200)


def validate_get_all_user_transfers_monthly(data: Optional[Mapping[str, Any]]) -> Optional[str]:
    if not data:
        return "emptyRequestPayload"
    if 'year' not in data:
        return "yearNotProvided"
    if 'year' in data and not isinstance(data['year'], int):
        return "yearInvalidType"
    return None


def get_transfers_analysis_monthly(transfers: list[dict]) -> list[dict[str, Any]]:
    formatted_transfers = format_transfers_date(transfers, get_month_from_datetime)
    grouped_transfers = accumulate_transactions_income_and_outcome(formatted_transfers)
    formatted_grouped_transfers = format_grouped_transfers(grouped_transfers)
    return get_response_monthly(formatted_grouped_transfers)
