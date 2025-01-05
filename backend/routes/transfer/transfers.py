from collections import defaultdict

import bson
from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from transfers import TransferRepository, Transfer
from transfers.history_response import HistoryResponse
from transfers.history_transfer_dto import HistoryTransferDto
from transfers.grouped_history_transfers_dto import GroupedHistoryTransfersDto
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers() -> tuple[Response, int]:
    user: User = user_repository.find_by_id(current_user._id)
    if not user:
        return create_simple_response("userNotExist", 404)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", 404)

    transfers = fetch_transfers(str(account.id))
    if not transfers:
        return create_simple_response("transferListEmpty", 404)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", 403)

    history_transfer_dtos: list[HistoryTransferDto] = [prepare_transfer(transfer, account) for transfer in transfers]

    user_transfer_groups = group_transfers_by_date(history_transfer_dtos)
    grouped_transfers_dtos: list[dict] = [
        GroupedHistoryTransfersDto.from_transfer_group(date, user_transfers).to_dict()
        for date, user_transfers in user_transfer_groups.items()
    ]

    return HistoryResponse.create_response("transferListGetSuccessful", grouped_transfers_dtos, 200)


def prepare_transfer(transfer: Transfer, account: Account) -> HistoryTransferDto:
    is_income = transfer.transfer_to_id == account.id
    transfer_from_account = account_repository.find_by_id(str(transfer.transfer_from_id))
    transfer_from_user = user_repository.find_by_id(transfer_from_account.user)
    transfer_to_account = account_repository.find_by_id(str(transfer.transfer_to_id))
    transfer_to_user = user_repository.find_by_id(transfer_to_account.user)
    issuer_name = transfer_from_user.login if is_income else transfer_to_user.login
    return HistoryTransferDto.from_transfer(transfer, is_income, issuer_name)


def fetch_transfers(account_id: str) -> list[Transfer]:
    query = {
        '$or': [
            {'transfer_from_id': account_id},
            {'transfer_to_id': account_id}
        ]
    }
    sort_criteria = [("created", -1)]
    return transfer_repository.find_transfers(query, sort_criteria)


def group_transfers_by_date(history_transfer_dtos: list[HistoryTransferDto]) -> dict[str, list[HistoryTransferDto]]:
    grouped_transfers = defaultdict(list)

    for dto in history_transfer_dtos:
        grouped_transfers[dto.created].append(dto)

    return dict(grouped_transfers)
