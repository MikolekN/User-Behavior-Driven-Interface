from typing import Any

from flask import Response
from flask_login import login_required, current_user

from routes.transfer.helpers import format_transfers_date, get_date_from_datetime, serialize_transfers, create_response
from transfers import TransferRepository, Transfer

transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers() -> tuple[Response, int]:
    transfers = fetch_user_transfers()

    if not transfers:
        return create_response("transferListEmpty", 404)

    serialized_transfers = serialize_transfers(transfers)
    response_data = prepare_transfers_response(serialized_transfers)

    return create_response(message="transferListGetSuccessful", status_code=200, data=response_data)


def fetch_user_transfers() -> list[Transfer]:
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ]
    }
    sort_criteria = [("created", -1)]
    return transfer_repository.find_transfers(query, sort_criteria)


def prepare_transfers_response(transfers: list[dict]) -> list[dict[str, Any]]:
    formatted_transfers = format_transfers_date(transfers, get_date_from_datetime)
    grouped_transfers = group_transfers_by_date(formatted_transfers)
    return build_response_from_grouped_transfers(grouped_transfers)


def group_transfers_by_date(transfers: list[dict]) -> dict[str, Any]:
    grouped = {}
    for t in transfers:
        date = t['created']
        grouped.setdefault(date, []).append(t)
    return grouped


def build_response_from_grouped_transfers(transfers: dict) -> list[dict[str, Any]]:
    return [{"date": date, "transactions": transactions} for date, transactions in transfers.items()]
