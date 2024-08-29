from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_user, logout_user
import bcrypt
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users.user_repository import UserRepository
from users.user import User

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

def validate_login_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "Request payload is empty"
    if 'login' not in data or 'password' not in data:
        return "Login and password fields are required"
    return None

def sanitize_user_dict(user: User) -> dict[str, Any]:
    user_dict = user.to_dict()
    user_dict.pop('password', None)
    user_dict['_id'] = str(user_dict['_id'])
    return user_dict

@authorisation_blueprint.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409

    data = request.get_json()
    error = validate_login_data(data)
    if error:
        return jsonify(message=error), 400

    user = UserRepository.find_by_login(data['login'])
    if user is None:
        return jsonify(message="User does not exist"), 404

    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(status="error", message="Invalid login credentials"), 401

    login_user(user)
    sanitized_user = sanitize_user_dict(user)
    return jsonify(message="Logged in successfully", user=sanitized_user), 200

@authorisation_blueprint.route('/logout', methods=['POST'])
def logout() -> tuple[Response, int]:
    if not current_user.is_authenticated:
        return jsonify(message="No user logged in"), 409

    logout_user()
    return jsonify(message="Logged out successfully"), 200

@authorisation_blueprint.route('/register', methods=['POST'])
def register() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return jsonify(message="Already logged in"), 409

    data = request.get_json()
    error = validate_login_data(data)
    if error:
        return jsonify(message=error), 400

    if UserRepository.find_by_login(data['login']):
        return jsonify(message="User already exists"), 409

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(data['login'], hashed_password, created=datetime.now())
    user = UserRepository.insert(user)

    sanitized_user = sanitize_user_dict(user)
    return jsonify(message="User registered successfully", user=sanitized_user), 201