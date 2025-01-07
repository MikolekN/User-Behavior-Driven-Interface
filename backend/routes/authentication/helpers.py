from collections.abc import Mapping
from http import HTTPStatus
from typing import Optional, Any

import bcrypt

from users import User, UserRepository

user_repository = UserRepository()

def validate_login_data(data: Optional[Mapping[str, Any]]) -> Optional[str]:
    if not data:
        return "emptyRequestPayload"
    if 'email' not in data or 'password' not in data:
        return "authFieldsRequired"
    if not isinstance(data['email'], str) or not isinstance(data['password'], str):
        return "invalidAuthFieldsType"
    if data['email'].strip() == "" or data['password'].strip() == "":
        return "emptyAuthFields"
    return None

def authenticate_user(email: str, password: str) -> tuple[Optional[User], Optional[str], Optional[HTTPStatus]]:
    user = user_repository.find_by_email(email)
    if user is None:
        return None, "userNotExist", HTTPStatus.NOT_FOUND

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None, "invalidCredentials", HTTPStatus.UNAUTHORIZED

    return user, None, None
