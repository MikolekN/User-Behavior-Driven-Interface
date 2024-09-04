from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_required
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users.user_repository import UserRepository
from transfers.transfer_repository import TransferRepository
from transfers.transfer import Transfer
from bson import ObjectId

transfer_blueprint = Blueprint('transfer', __name__, url_prefix='/api')

def validate_transfer_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if 'recipentAccountNumber' not in data or 'transferTitle' not in data or 'amount' not in data:
        return "All fields are required"
    return None

def sanitize_transfer_dict(transfer: dict) -> dict[str, any]:
    serialized_transfer = {}
    for key, value in transfer.items():
        if isinstance(value, ObjectId):
            serialized_transfer[key] = str(value)
        else:
            serialized_transfer[key] = value
    return serialized_transfer

def set_income_flag(transfer: dict) -> dict[str, any]:
    if 'transfer_from_id' in transfer and transfer['transfer_from_id'] == current_user._id:
        transfer['income'] = False
        issuer = UserRepository.find_by_id(transfer['transfer_to_id'])
        transfer['issuer_name'] = issuer.login

    elif 'transfer_to_id' in transfer and transfer['transfer_to_id'] == current_user._id:
        transfer['income'] = True
        issuer = UserRepository.find_by_id(transfer['transfer_from_id'])
        transfer['issuer_name'] = issuer.login

    return transfer

def serialize_transfer_dict(transfer: dict) -> dict[str, any]:
    transfer = set_income_flag(transfer)
    transfer = sanitize_transfer_dict(transfer)
    return transfer

def serialize_transfers(transfers: dict) -> dict[str, any]:
    serialized_transfers = []

    for t in transfers:
        serialized_transfers.append(serialize_transfer_dict(t))

    return serialized_transfers

@transfer_blueprint.route('/transfer', methods=['POST'])
@login_required
def make_transfer() -> tuple[Response, int]:
    data = request.get_json()
    error = validate_transfer_data(data)

    if error:
        return jsonify(message=error), 400
    
    recipent_user = UserRepository.find_by_account_number(data['recipentAccountNumber'])
    
    if not recipent_user:
        return jsonify(message="User with given account number does not exist"), 404
    
    if current_user.available_funds - float(data['amount']) < 0:
        return jsonify(message="User does not have enough money"), 403

    transfer = Transfer(created=datetime.now(), transfer_from_id=current_user._id,
                        transfer_to_id=recipent_user._id, title=data['transferTitle'], amount=float(data['amount']))
    transfer = TransferRepository.insert(transfer)

    UserRepository.update(current_user._id, {'available_funds': float(current_user.available_funds) - float(data['amount'])})
    UserRepository.update(recipent_user._id, {'available_funds': float(recipent_user.available_funds) + float(data['amount'])})

    return jsonify(message="Transfer made successfully"), 200 # maybe add some response json

@transfer_blueprint.route('/transfers', methods=['GET'])
@login_required
def get_transfers() -> tuple[Response, int]:
    transfers = TransferRepository.find_all_user_transfers(current_user._id, current_user._id)
    serialized_transfers = serialize_transfers(transfers)

    return jsonify(message="Transfers returned successfully", transfers=serialized_transfers), 200