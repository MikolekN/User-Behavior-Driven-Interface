from collections import defaultdict
from datetime import datetime
from http import HTTPStatus

import bson
from flask import Response
from flask_login import login_required, current_user

from accounts import Account, AccountRepository
from routes.helpers import create_simple_response
from routes.transfer.helpers import prevent_unauthorised_account_access
from transfers import TransferRepository, Transfer
from transfers.responses.get_transfers_response import GetTransfersResponseDto
from users import UserRepository, User

user_repository = UserRepository()
account_repository = AccountRepository()
transfer_repository = TransferRepository()


@login_required
def get_all_user_transfers() -> Response:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    if not user.active_account:
        return create_simple_response("activeAccountNotSet", HTTPStatus.BAD_REQUEST)

    account: Account = account_repository.find_by_id(str(user.active_account))
    if not account:
        return create_simple_response("accountNotExist", HTTPStatus.NOT_FOUND)

    transfers = fetch_transfers(str(account.number))
    if not transfers:
        return create_simple_response("transferListEmpty", HTTPStatus.NOT_FOUND)

    if prevent_unauthorised_account_access(account):
        return create_simple_response("unauthorisedAccountAccess", HTTPStatus.UNAUTHORIZED)

    transfer_dtos: list[dict] = [prepare_transfer(transfer, account) for transfer in transfers]

    transfer_groups = group_transfers_by_date(transfer_dtos)
    grouped_transfers_dtos: list[dict] = [
        {
            "date": date,
            "transactions": transfers_dtos
        }
        for date, transfers_dtos in transfer_groups.items()
    ]

    return GetTransfersResponseDto.create_response("transferListGetSuccessful", grouped_transfers_dtos, HTTPStatus.OK)


def prepare_transfer(transfer: Transfer, account: Account) -> dict:
    is_income = transfer.recipient_account_number == account.number

    transfer_from_account: Account = account_repository.find_by_account_number_full(transfer.sender_account_number)
    if transfer_from_account.user:
        transfer_from_user = user_repository.find_by_id_full(str(transfer_from_account.user))
        issuer_name_from = transfer_from_user.login if transfer_from_user else "Unknown"
    else:
        issuer_name_from = transfer_from_account.name

    transfer_to_account: Account = account_repository.find_by_account_number_full(transfer.recipient_account_number)
    if transfer_to_account.user:
        transfer_to_user = user_repository.find_by_id_full(str(transfer_to_account.user))
        issuer_name_to = transfer_to_user.login if transfer_to_user else "Unknown"
    else:
        issuer_name_to = transfer_to_account.name

    issuer_name = issuer_name_from if is_income else issuer_name_to

    transfer = transfer.to_dict()
    transfer["is_income"] = is_income
    transfer["issuer_name"] = issuer_name

    return transfer


def fetch_transfers(account_number: str) -> list[Transfer]:
    query = {
        '$or': [
            {'sender_account_number': account_number},
            {'recipient_account_number': account_number}
        ]
    }
    sort_criteria = [("created", -1)]
    return transfer_repository.find_transfers(query, sort_criteria)


def group_transfers_by_date(transfer_dtos: list[dict]) -> dict[str, list[dict]]:
    grouped_transfers = defaultdict(list)

    for dto in transfer_dtos:
        grouped_transfers[str(datetime.fromisoformat(dto['created']).strftime('%d.%m.%Y'))].append(dto)

    return dict(grouped_transfers)
