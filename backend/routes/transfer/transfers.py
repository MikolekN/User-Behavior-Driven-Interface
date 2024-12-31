from collections import defaultdict

from flask import Response
from flask_login import login_required, current_user

from routes.helpers import create_simple_response
from transfers import TransferRepository, Transfer
from transfers.history_response import HistoryResponse
from transfers.history_transfer_dto import HistoryTransferDto
from transfers.grouped_history_transfers_dto import GroupedHistoryTransfersDto
from users import UserRepository, User

user_repository = UserRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers() -> tuple[Response, int]:
    transfers = fetch_user_transfers()

    if not transfers:
        return create_simple_response("transferListEmpty", 404)

    user: User = user_repository.find_by_id(current_user._id)
    history_transfer_dtos: list[HistoryTransferDto] = [prepare_user_transfer(transfer, user) for transfer in transfers]

    user_transfer_groups = group_transfers_by_date(history_transfer_dtos)
    grouped_transfers_dtos: list[dict] = [
        GroupedHistoryTransfersDto.from_transfer_group(date, user_transfers).to_dict()
        for date, user_transfers in user_transfer_groups.items()
    ]

    return HistoryResponse.create_response("transferListGetSuccessful", grouped_transfers_dtos, 200)


def prepare_user_transfer(transfer: Transfer, user: User) -> HistoryTransferDto:
    is_income = transfer.transfer_to_id == user.id
    transfer_from_user = user_repository.find_by_id(str(transfer.transfer_from_id))
    transfer_to_user = user_repository.find_by_id(str(transfer.transfer_to_id))
    issuer_name = transfer_from_user.login if is_income else transfer_to_user.login
    return HistoryTransferDto.from_transfer(transfer, is_income, issuer_name)


def fetch_user_transfers() -> list[Transfer]:
    query = {
        '$or': [
            {'transfer_from_id': current_user._id},
            {'transfer_to_id': current_user._id}
        ]
    }
    sort_criteria = [("created", -1)]
    return transfer_repository.find_transfers(query, sort_criteria)


def group_transfers_by_date(history_transfer_dtos: list[HistoryTransferDto]) -> dict[str, list[HistoryTransferDto]]:
    grouped_transfers = defaultdict(list)

    for dto in history_transfer_dtos:
        grouped_transfers[dto.created].append(dto)

    return dict(grouped_transfers)
