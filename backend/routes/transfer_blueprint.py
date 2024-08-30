from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_required
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users.user_repository import UserRepository
from transfers.transfer_repository import TransferRepository
from transfers.transfer import Transfer

transfer_blueprint = Blueprint('transfer', __name__, url_prefix='/api')

def validate_transfer_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if 'recipentAccountNumber' not in data or 'transferTitle' not in data or 'amount' not in data:
        return "All fields are required"
    return None

def sanitize_transfer_dict(transfer: Transfer) -> dict[str, any]:
    transfer_dict = transfer.to_dict()
    transfer_dict['_id'] = str(transfer_dict['_id'])
    return transfer_dict

@transfer_blueprint.route('/transfer', methods=['POST'])
@login_required
def make_transfer() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_transfer_data(data)

    if error:
        return jsonify(message=error), 400
    
    recipent_user = UserRepository.find_by_account_number(data['recipentAccountNumber'])
    
    if not recipent_user:
        return jsonify(message="User with given account number does not exist"), 409

    transfer = Transfer(created=datetime.now(), transfer_from_id=current_user._id,
                        transfer_to_id=recipent_user._id, title=data['transferTitle'], amount=float(data['amount']))
    transfer = TransferRepository.insert(transfer)

    UserRepository.update(current_user._id, {'available_funds': float(current_user.available_funds) - float(data['amount'])})
    UserRepository.update(recipent_user._id, {'available_funds': float(recipent_user.available_funds) + float(data['amount'])})

    return jsonify(message="Transfer made successfully"), 200 # maybe add some response json