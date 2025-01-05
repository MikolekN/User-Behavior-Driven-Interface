from typing import Optional

from flask import Response, request, Blueprint
from flask_login import current_user
from flask_login import login_required

from routes.helpers import create_simple_response, hash_password, verify_password
from users import UserRepository, User
from users.user_dto import UserDto
from users.user_response import UserResponse

user_blueprint = Blueprint('user_update', __name__, url_prefix='/api')

user_repository = UserRepository()

@user_blueprint.route('/user', methods=['GET'])
@login_required
def get_user() -> tuple[Response, int]:
    user = user_repository.find_by_id(current_user._id)
    if not user:
        return create_simple_response("userNotExist", 404)

    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("userFetchSuccessful", user_dto.to_dict(), 200)

def validate_user_update_data(user_data: dict) -> Optional[str]:
    if not user_data:
        return "emptyRequestPayload"

    valid_fields = {'login', 'current_password', 'new_password'}
    invalid_fields = [field for field in user_data if field not in valid_fields]

    if invalid_fields:
        return f"missingFields;{', '.join(invalid_fields)}"

    if ('current_password' in user_data or 'new_password' in user_data) and ('current_password' not in user_data or 'new_password' not in user_data):
        return "userPasswordRequiredFields"

    return None

@user_blueprint.route("/user/update", methods=['PATCH'])
@login_required
def update_user() -> tuple[Response, int]:
    data = request.json

    error = validate_user_update_data(data)
    if error:
        return create_simple_response(error, 400)

    result = None
    for field in data:
        match field:
            case 'login':
                result = update_login(data['login'])
            case 'new_password':
                result = update_password(data['current_password'], data['new_password'])
    if isinstance(result, tuple):
        return result
    elif isinstance(result, User):
        return UserResponse.create_response("userUpdateSuccessful", UserDto.from_user(result).to_dict(), 200)


def update_login(login: str) -> tuple[Response, int] | User:
    login_data = {'login': login}
    try:
        updated_user: User = user_repository.update(current_user._id, login_data)
        if not updated_user:
            return create_simple_response("userUpdateNotFound", 404)
        return updated_user
    except Exception as e:
        return create_simple_response(f"errorUpdateUser;{str(e)}", 500)

def update_password(current_password: str, new_password: str) -> tuple[Response, int] | User:
    user: User = user_repository.find_by_id(current_user._id)
    if not user or not verify_password(user.password, current_password):
        return create_simple_response("incorrectCurrentPassword", 401)

    try:
        hashed_new_password = hash_password(new_password)
        updated_user: User = user_repository.update(current_user._id, {'password': hashed_new_password})
        if not updated_user:
            return create_simple_response("userUpdateNotFound", 404)
        return updated_user
    except Exception as e:
        return create_simple_response(f"errorUpdatePassword;{str(e)}", 500)