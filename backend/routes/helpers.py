from functools import wraps

import bcrypt
from flask import Response, jsonify, make_response
from flask_login import current_user
from http import HTTPStatus

from constants import ALLOWED_EXTENSIONS


def create_simple_response(message: str, status: HTTPStatus) -> Response:
    response = make_response(jsonify({"message": message}), status)
    response.headers["Content-Type"] = "application/json"
    return response

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
