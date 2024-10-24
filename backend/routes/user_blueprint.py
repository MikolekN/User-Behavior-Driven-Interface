from flask import Response, request, jsonify, Blueprint
from flask_login import current_user, login_required
from flask_login import login_required
from ..users import UserRepository

import bcrypt

user_blueprint = Blueprint('user_update', __name__, url_prefix='/api')

@user_blueprint.route('/user', methods=['GET'])
@login_required
def get_user() -> tuple[Response, int]:
    user = UserRepository.find_by_id(current_user._id)
    sanitized_user = user.sanitize_user_dict()
    return jsonify(user=sanitized_user), 200

@user_blueprint.route("/user/update", methods=['PATCH'])
@login_required
def update_user_field() -> Response:
    user_data = request.json

    if not user_data:
        return jsonify(message="No data provided"), 400

    valid_fields = {'login', 'account_name', 'currency'}
    
    for field, _ in user_data.items():
        if field not in valid_fields:
            return jsonify(message=f"Invalid field: {field}"), 400

    try:
        UserRepository.update(current_user._id, user_data)

        updated_user = UserRepository.find_by_id(current_user._id)
        if not updated_user:
            return jsonify(message="User not found after update"), 404

        return jsonify(message="User data updated successfully", user=updated_user.to_dict()), 200
    except Exception as e:
        return jsonify(message=f"Error updating user data: {str(e)}"), 500

@user_blueprint.route("/user/password", methods=['PATCH'])
@login_required
def change_user_password() -> Response:
    data = request.json

    if not data or 'current_password' not in data or 'new_password' not in data:
        return jsonify(message="Current password and new password are required"), 400

    current_password = data['current_password']
    new_password = data['new_password']

    user = UserRepository.find_by_id(current_user._id)
    if not bcrypt.checkpw(current_password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(message="Current password is incorrect"), 401

    try:
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        UserRepository.update(current_user._id, {'password': hashed_new_password})
        return jsonify(message="Password updated successfully"), 200
    except Exception as e:
        return jsonify(message=f"Error updating password: {str(e)}"), 500
