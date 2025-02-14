from collections.abc import Mapping
from datetime import datetime
from http import HTTPStatus
from typing import Any, Optional

from flask import Response, request
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from routes.transfer.helpers import serialize_transfers, \
    format_transfers_date, format_grouped_transfers, get_month_from_datetime, \
    accumulate_transactions_income_and_outcome, get_response_monthly
from transfers import TransferRepository
from transfers.requests.monthly_analysis_request_dto import MonthlyAnalysisRequestDto
from transfers.responses.analysis_response import AnalysisResponse
from users import User, UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers_monthly() -> Response:
    data = request.get_json()

    error = MonthlyAnalysisRequestDto.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    year = data['year']
    start_date, end_date = f"{year}-01-01T00:00:00", f"{year}-12-31T23:59:59"
    query = {
        '$or': [
            {'sender_account_number': account.number},
            {'recipient_account_number': account.number}
        ],
        'created': {'$gte': datetime.fromisoformat(start_date), '$lt': datetime.fromisoformat(end_date)}
    }

    transfers = transfer_repository.find_transfers(query)
    if not transfers:
        return create_simple_response("monthlyAnalysisEmpty", HTTPStatus.NOT_FOUND)

    serialized_transfers = serialize_transfers(transfers, account)
    response = get_transfers_analysis_monthly(serialized_transfers)

    return AnalysisResponse.create_response("monthlyAnalysisSuccessful", response, HTTPStatus.OK)


def get_transfers_analysis_monthly(transfers: list[dict]) -> list[dict[str, Any]]:
    formatted_transfers = format_transfers_date(transfers, get_month_from_datetime)
    grouped_transfers = accumulate_transactions_income_and_outcome(formatted_transfers)
    formatted_grouped_transfers = format_grouped_transfers(grouped_transfers)
    return get_response_monthly(formatted_grouped_transfers)
