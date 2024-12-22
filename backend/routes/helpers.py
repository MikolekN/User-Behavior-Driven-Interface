from collections.abc import Mapping
import random
from typing import Optional, Any

import bcrypt
from flask import Response, jsonify

from constants import ALLOWED_EXTENSIONS


def create_response(message: str, status_code: int, data: Optional[dict] = None) -> tuple[Response, int]:
    response = {"message": message}
    if data:
        response['user'] = data
    return jsonify(response), status_code

def validate_login_data(data: Optional[Mapping[str, Any]]) -> Optional[str]:
    if not data:
        return "emptyRequestPayload"
    if 'email' not in data or 'password' not in data:
        return "authFieldsRequired"
    return None

def generate_account_number() -> str:
    return ''.join(random.choices('0123456789', k=26))

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, current_password: str) -> bool:
    return bcrypt.checkpw(current_password.encode('utf-8'), password.encode('utf-8'))

def allowed_file_extension(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
