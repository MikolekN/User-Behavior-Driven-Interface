from collections.abc import Mapping
from http import HTTPStatus
from typing import Any, Optional

from flask import Response, request
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from routes.transfer.helpers import serialize_transfers, \
    set_missing_years, format_transfers_date, get_year_from_datetime, format_grouped_transfers, \
    accumulate_transactions_income_and_outcome, get_response_yearly
from transfers import TransferRepository
from transfers.requests.yearly_analysis_request_dto import YearlyAnalysisRequestDto
from transfers.responses.analysis_response import AnalysisResponse
from users import User, UserRepository

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers_yearly() -> Response:
    data = request.get_json()

    error = YearlyAnalysisRequestDto.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    start_date = f"{data['start_year']}-01-01T00:00:00"
    end_date = f"{data['end_year']}-12-31T23:59:59"
    query = {
        '$or': [
            {'transfer_from_id': account.id},
            {'transfer_to_id': account.id}
        ],
        'created': {
            '$gte': start_date,
            '$lt': end_date
        }
    }

    transfers = transfer_repository.find_transfers(query)
    if not transfers:
        return create_simple_response("yearlyAnalysisEmpty", HTTPStatus.NOT_FOUND)

    serialized_transfers = serialize_transfers(transfers, account)
    response = set_missing_years(get_transfers_analysis_yearly(serialized_transfers), int(data['start_year']),
                                 int(data['end_year']))

    return AnalysisResponse.create_response("yearlyAnalysisSuccessful", response, HTTPStatus.OK)


def get_transfers_analysis_yearly(transfers: list[dict]) -> list[dict[str, Any]]:
    formatted_transfers = format_transfers_date(transfers, get_year_from_datetime)
    acc_grouped_transfers = format_grouped_transfers(accumulate_transactions_income_and_outcome(formatted_transfers))
    response = get_response_yearly(acc_grouped_transfers)
    return response