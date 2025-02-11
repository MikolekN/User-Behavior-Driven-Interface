from collections import defaultdict
from http import HTTPStatus

import bson
from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from transfers import TransferRepository, Transfer
from transfers.responses.get_transfers_response import GetTransfersResponseDto
from transfers.history_transfer_dto import HistoryTransferDto
from transfers.grouped_history_transfers_dto import GroupedHistoryTransfersDto
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    transfers = fetch_transfers(str(account.account_number))
    if not transfers:
        return create_simple_response("transferListEmpty", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    history_transfer_dtos: list[HistoryTransferDto] = [prepare_transfer(transfer, account) for transfer in transfers]

    user_transfer_groups = group_transfers_by_date(history_transfer_dtos)
    grouped_transfers_dtos: list[dict] = [
        GroupedHistoryTransfersDto.from_transfer_group(date, user_transfers).to_dict()
        for date, user_transfers in user_transfer_groups.items()
    ]

    return GetTransfersResponseDto.create_response("transferListGetSuccessful", grouped_transfers_dtos, HTTPStatus.OK)


def prepare_transfer(transfer: Transfer, account: Account) -> HistoryTransferDto:
    is_income = transfer.recipient_account_number == account.id

    transfer_from_account: Account = account_repository.find_by_account_number(transfer.sender_account_number)
    if transfer_from_account.user:
        transfer_from_user = user_repository.find_by_id(str(transfer_from_account.user))
        issuer_name_from = transfer_from_user.login if transfer_from_user else "Unknown"
    else:
        issuer_name_from = transfer_from_account.account_name

    transfer_to_account: Account = account_repository.find_by_account_number(transfer.recipient_account_number)
    if transfer_to_account.user:
        transfer_to_user = user_repository.find_by_id(str(transfer_to_account.user))
        issuer_name_to = transfer_to_user.login if transfer_to_user else "Unknown"
    else:
        issuer_name_to = transfer_to_account.account_name

    issuer_name = issuer_name_from if is_income else issuer_name_to
    return HistoryTransferDto.from_transfer(transfer, is_income, issuer_name)


def fetch_transfers(account_number: str) -> list[Transfer]:
    query = {
        '$or': [
            {'sender_account_number': account_number},
            {'recipient_account_number': account_number}
        ]
    }
    sort_criteria = [("created", -1)]
    return transfer_repository.find_transfers(query, sort_criteria)


def group_transfers_by_date(history_transfer_dtos: list[HistoryTransferDto]) -> dict[str, list[HistoryTransferDto]]:
    grouped_transfers = defaultdict(list)

    for dto in history_transfer_dtos:
        grouped_transfers[dto.created].append(dto)

    return dict(grouped_transfers)
