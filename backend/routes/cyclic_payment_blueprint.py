from bson import ObjectId
import bson
from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_required
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users.user import User
from users.user_repository import UserRepository
from cyclic_payments.cyclic_payment import CyclicPayment
from cyclic_payments.cyclic_payment_repository import CyclicPaymentRepository
from helpers.calculations import add, substract

cyclic_payment_blueprint = Blueprint('cyclic_payment', __name__, url_prefix='/api')

def validate_required_cyclic_payment_fields(data: Mapping[str, Any]) -> str | None:
    required_fields = ['cyclicPaymentName', 'recipientAccountNumber', 'transferTitle', 'amount', 'startDate', 'interval']
    field_names = ""
    for field in required_fields:
        if field not in data:
            field_names += field + " "
        
    if field_names:
        return f"Fields: '{field_names}' are required"
    
    return None

def validate_cyclic_payment_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    
    message = validate_required_cyclic_payment_fields(data)
    if message:
        return message

    amount = float(data.get('amount'))
    if amount <= 0:
        return "Amount must be a positive number"

    try:
        start_date = data.get('startDate')
        datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    except (TypeError, ValueError):
        return "Invalid date format. Expected ISO 8601 format"

    return None

def validate_update_cyclic_payment(data: Mapping[str, Any] | None, id: str) -> str | None:
    if not data:
        return "Request payload is empty"
    
    message = validate_object_id(id)
    if message:
        return message
    
    message = validate_required_cyclic_payment_fields(data)
    if message:
        return message
    
    return None

def sanitize_cyclic_payment_dict(cyclic_payment: CyclicPayment) -> dict[str, Any]:
    sanitized_cyclic_payment_dict = cyclic_payment.to_dict()
    for key, value in sanitized_cyclic_payment_dict.items():
        if isinstance(value, ObjectId):
            sanitized_cyclic_payment_dict[key] = str(value)
        else:
            sanitized_cyclic_payment_dict[key] = value
    return sanitized_cyclic_payment_dict

def format_cyclic_payment_dict(cyclic_payment: dict[str, Any]) -> dict[str, Any]:
    cyclic_payment.pop('created', None)
    cyclic_payment.pop('issuer_id', None)
    cyclic_payment.pop('recipient_id', None)

    return cyclic_payment

def validate_object_id(oid: str) -> str | None:
    if not ObjectId.is_valid(oid):
        return "Invalid Object ID"
    return None

def serialize_cyclic_payments(cyclic_payments: list[CyclicPayment]) -> dict[str, any]:
    serialized_cyclic_payments = []

    for t in cyclic_payments:
        serialized_cyclic_payments.append(format_cyclic_payment_dict(sanitize_cyclic_payment_dict(t)))

    return serialized_cyclic_payments

def get_cyclic_payment_update_content_and_query(id: str, data: dict[str, any], recipient_user: User) -> tuple[dict[str, any], dict[str, any]]:
    query = {
        '_id': bson.ObjectId(id)
    }

    cyclic_payment_content = {
        "recipient_id": recipient_user._id,
        "amount": float(data['amount']),
        "cyclic_payment_name": data['cyclicPaymentName'],
        "interval": data['interval'],
        "recipient_account_number": data['recipientAccountNumber'],
        "recipient_name": recipient_user.login,
        "start_date": data['startDate'],
        "transfer_title": data['transferTitle']
    }

    return query, cyclic_payment_content


@cyclic_payment_blueprint.route('/cyclic-payment', methods=['POST'])
@login_required
def create_cyclic_payment() -> tuple[Response, int]:
    data = request.get_json()

    error = validate_cyclic_payment_data(data)
    if error:
        return jsonify(message=error), 400
    
    recipient_user = UserRepository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_user:
        return jsonify(message="User with given account number does not exist"), 404
    
    if current_user.get_available_funds() - float(data['amount']) < 0:
        return jsonify(message="User does not have enough money"), 403
    
    cyclic_payment = CyclicPayment(created=datetime.now(), issuer_id=current_user._id, recipient_id=recipient_user._id, 
                                   recipient_account_number=data['recipientAccountNumber'], recipient_name=recipient_user.login,
                                   cyclic_payment_name=data['cyclicPaymentName'], transfer_title=data['transferTitle'], 
                                   amount=float(data['amount']), start_date=datetime.fromisoformat(data['startDate']), 
                                   interval=data['interval'])
    cyclic_payment = CyclicPaymentRepository.insert(cyclic_payment)

    # added amount from cyclic payment to the issuer user blockades
    # no action is made at this moment with recipient account 
    UserRepository.update(current_user._id, {'blockades': add(float(current_user.blockades), float(data['amount']))})

    sanitized_cyclic_payment = sanitize_cyclic_payment_dict(cyclic_payment)
    formatted_cyclic_payment = format_cyclic_payment_dict(sanitized_cyclic_payment)
    return jsonify(message="Cyclic Payment created successfully", cyclic_payment=formatted_cyclic_payment), 200

@cyclic_payment_blueprint.route('/cyclic-payment/<id>', methods=['GET'])
@login_required
def get_cyclic_payment(id) -> tuple[Response, int]:
    erorr = validate_object_id(id)
    if erorr:
        return jsonify(message=erorr), 400

    cyclic_payment = CyclicPaymentRepository.find_by_id(str(id))
    if not cyclic_payment:
        return jsonify(message="Cyclic Payment with given ID does not exist"), 404
    
    print(cyclic_payment)
 
    sanitized_cyclic_payment = sanitize_cyclic_payment_dict(cyclic_payment)
    formatted_cyclic_payment = format_cyclic_payment_dict(sanitized_cyclic_payment)
    return jsonify(message="Get Cyclic Payment by id successfully", cyclic_payment=formatted_cyclic_payment), 200

@cyclic_payment_blueprint.route('/cyclic-payment/<id>', methods=['DELETE'])
@login_required
def delete_cyclic_payment(id) -> tuple[Response, int]:
    erorr = validate_object_id(id)
    if erorr:
        return jsonify(message=erorr), 400
    
    # substracting cyclic payment amount from current user's blockades
    cyclic_payment = CyclicPaymentRepository.find_by_id(str(id))
    if not cyclic_payment:
        return jsonify(message="Cyclic Payment with given ID does not exist"), 404
    
    curr_user = UserRepository.find_by_id(current_user._id)
    UserRepository.update(curr_user._id, {'blockades': substract(float(curr_user.blockades), float(cyclic_payment.amount))})

    CyclicPaymentRepository.delete_by_id(str(id))
 
    return jsonify(message="Cyclic Payment deleted successfully"), 200

@cyclic_payment_blueprint.route('/cyclic-payment/<id>', methods=['PUT'])
@login_required
def update_cyclic_payment(id) -> tuple[Response, int]:
    data = request.get_json()
    erorr = validate_update_cyclic_payment(data, id)
    if erorr:
        return jsonify(message=erorr), 400
    
    recipient_user = UserRepository.find_by_account_number(data['recipientAccountNumber'])
    if not recipient_user:
        return jsonify(message="User with given account number does not exist"), 404
    
    # clear user blockades by substracting old cyclic payment amount and adding updated cyclic payment amount to the current user blockades
    cyclic_payment = CyclicPaymentRepository.find_by_id(str(id))
    curr_user = UserRepository.find_by_id(current_user._id)
    UserRepository.update(curr_user._id, {'blockades': add(substract(float(curr_user.blockades), float(cyclic_payment.amount)), float(data["amount"]))})
    
    query, cyclic_payment_content = get_cyclic_payment_update_content_and_query(id, data, recipient_user)
    updated_cyclic_payment = CyclicPaymentRepository.update_by_id(str(id), query, cyclic_payment_content)
    if not updated_cyclic_payment:
        return jsonify(message="Cyclic Payment with given ID does not exist"), 404

    sanitized_cyclic_payment = sanitize_cyclic_payment_dict(updated_cyclic_payment)
    return jsonify(message="Cyclic Payment updated successfully", cyclic_payment=sanitized_cyclic_payment), 200

@cyclic_payment_blueprint.route('/cyclic-payments', methods=['GET'])
@login_required
def get_all_user_cyclic_payment() -> tuple[Response, int]:
    query = {
        'issuer_id': current_user._id
    }
    cyclic_payments = CyclicPaymentRepository.find_cyclic_payments(query)
    if not cyclic_payments:
        return jsonify(message="Cyclic Payments list for current user is empty"), 404
    
    cyclic_payments = serialize_cyclic_payments(cyclic_payments)
 
    return jsonify(message="Cyclic Payments list retured successfully", cyclic_payments=cyclic_payments), 200