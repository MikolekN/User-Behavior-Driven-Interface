from functools import wraps
from http import HTTPStatus

import bcrypt
from flask_login import current_user
from shared import create_simple_response

from constants import ALLOWED_EXTENSIONS


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, current_password: str) -> bool:
    return bcrypt.checkpw(current_password.encode('utf-8'), password.encode('utf-8'))


def allowed_file_extension(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def unauthenticated_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.is_authenticated:
            return create_simple_response("alreadyLogged", HTTPStatus.CONFLICT)
        return func(*args, **kwargs)

    return wrapper
