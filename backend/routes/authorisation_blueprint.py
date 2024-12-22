from typing import Optional
from datetime import datetime

import bcrypt
from flask import Blueprint, request, jsonify, Response
from flask_login import current_user, login_user, logout_user, login_required

from routes.helpers import create_response, validate_login_data, hash_password, generate_account_number
from users import *
from users.user_dto import UserDto

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

user_repository = UserRepository()


def authenticate_user(email: str, password: str) -> tuple[Optional[User], Optional[str]]:
    user = user_repository.find_by_email(email)
    if user is None:
        return None, "userNotExist"

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None, "invalidCredentials"

    return user, None

@authorisation_blueprint.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return create_response("alreadyLogged", 409)

    data = request.get_json()

    # Validate request data
    error = validate_login_data(data)
    if error:
        return create_response(error, 400)

    # Authenticate user
    user, error = authenticate_user(data['email'], data['password'])
    if user is None:
        return create_response(error, 404)

    # Log the user in
    login_user(user)
    user_dto = UserDto.from_user(user)
    return create_response("loginSuccessful", 200, user_dto.to_dict())

@authorisation_blueprint.route('/logout', methods=['POST'])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return create_response("logoutSuccessful", 200)

@authorisation_blueprint.route('/register', methods=['POST'])
def register() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return create_response("alreadyLogged", 409)

    data = request.get_json()

    # Validate request data
    error = validate_login_data(data)
    if error:
        return create_response(error, 400)

    if user_repository.find_by_email(data['email']):
        return create_response("userExist", 409)

    # Create a new User object
    # TODO: figure out 'account_name', 'account_number', and 'balance'
    user = User(
        login=data['email'],
        email=data['email'],
        password=hash_password(data['password']),
        created=datetime.now(),
        account_name='Account name',
        account_number=generate_account_number(),
        blockades=0,
        balance=2000,
        currency='PLN',
        user_icon=None,
        role='USER')

    # Create a user
    user = user_repository.insert(user)
    user_dto = UserDto.from_user(user)
    return jsonify(message="registerSuccessful", user=user_dto.to_dict()), 201
