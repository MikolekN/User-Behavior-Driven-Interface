from typing import Optional
from datetime import datetime

import bcrypt
from flask import Blueprint, request, Response
from flask_login import current_user, login_user, logout_user, login_required

from routes.helpers import create_simple_response, validate_login_data, hash_password, generate_account_number
from users import *
from users.user_response import UserResponse
from users.user_dto import UserDto

authorisation_blueprint = Blueprint('authorisation', __name__, url_prefix='/api')

user_repository = UserRepository()


def authenticate_user(email: str, password: str) -> tuple[Optional[User], Optional[str], Optional[int]]:
    user = user_repository.find_by_email(email)
    if user is None:
        return None, "userNotExist", 404

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None, "invalidCredentials", 401

    return user, None, None

@authorisation_blueprint.route('/login', methods=['POST'])
def login() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return create_simple_response("alreadyLogged", 409)

    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, 400)

    user, error, status_code = authenticate_user(data['email'], data['password'])
    if user is None:
        return create_simple_response(error, status_code)

    login_user(user)
    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("loginSuccessful", user_dto.to_dict(), 200)

@authorisation_blueprint.route('/logout', methods=['POST'])
@login_required
def logout() -> tuple[Response, int]:
    logout_user()
    return create_simple_response("logoutSuccessful", 200)

@authorisation_blueprint.route('/register', methods=['POST'])
def register() -> tuple[Response, int]:
    if current_user.is_authenticated:
        return create_simple_response("alreadyLogged", 409)

    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, 400)

    if user_repository.find_by_email(data['email']):
        return create_simple_response("userExist", 409)

    user = User(
        login=data['email'],
        email=data['email'],
        password=hash_password(data['password']),
        active_account=None,
        role='USER',
        user_icon=None
    )
    user = user_repository.insert(user)

    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("registerSuccessful", user_dto.to_dict(), 201)
