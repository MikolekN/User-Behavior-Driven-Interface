from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_user, logout_user, login_required
import bcrypt
from datetime import datetime
from collections.abc import Mapping
from typing import Any
from users import *

import random

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

def validate_login_data(data: Mapping[str, Any] | None) -> str | None:
    if not data:
        return "emptyRequestPayload"
    if 'email' not in data or 'password' not in data:
        return "authFieldsRequired"
    return None

@authorisation_blueprint.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return jsonify(message="alreadyLogged"), 409

    data = request.get_json()
    error = validate_login_data(data)
    if error:
        return jsonify(message=error), 400

    user = UserRepository.find_by_email(data['email'])
    if user is None:
        return jsonify(message="userNotExist"), 404

    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(message="invalidCredentials"), 401

    login_user(user)
    sanitized_user = user.sanitize_user_dict()
    return jsonify(message="loginSuccesful", user=sanitized_user), 200

@authorisation_blueprint.route('/logout', methods=['POST'])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return jsonify(message="logoutSuccesful"), 200

@authorisation_blueprint.route('/register', methods=['POST'])
def register() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return jsonify(message="alreadyLogged"), 409

    data = request.get_json()
    error = validate_login_data(data)
    if error:
        return jsonify(message=error), 400

    if UserRepository.find_by_email(data['email']):
        return jsonify(message="userExist"), 409

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # na razie dodaję tutaj w konstruktorze dodatkowe dane o użytkowniku dla ułatwienia
    # trzeba bedzie dogadać jak to finalnie rozwiążemy
    generated_account_number = ''.join(random.choices('0123456789', k=26))

    user = User(
        login=data['email'],
        email=data['email'],
        password=hashed_password,
        created=datetime.now(),
        account_name='Przykladowa nazwa konta',
        account_number=generated_account_number,
        blockades=0,
        balance=2000,
        currency='PLN',
        user_icon=None,
        role='USER')
    user = UserRepository.insert(user) # teraz przy tworzeniu zapisuje w bazie 'user_icon: null'. Trzeba będzie zrobić, żeby nic nie zapisywał.

    sanitized_user = user.sanitize_user_dict()
    return jsonify(message="registerSuccesful", user=sanitized_user), 201
