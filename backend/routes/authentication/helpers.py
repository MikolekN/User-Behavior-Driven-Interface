from http import HTTPStatus
from typing import Optional

import bcrypt

from users import User, UserRepository

user_repository = UserRepository()


def authenticate_user(email: str, password: str) -> tuple[Optional[User], Optional[str], Optional[HTTPStatus]]:
    user = user_repository.find_by_email(email)
    if user is None:
        return None, "userNotExist", HTTPStatus.NOT_FOUND

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return None, "invalidCredentials", HTTPStatus.UNAUTHORIZED

    return user, None, None
