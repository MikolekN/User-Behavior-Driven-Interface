from typing import Optional

from flask import Response, request, Blueprint
from flask_login import current_user
from flask_login import login_required

from routes.helpers import create_response, hash_password, verify_password
from users import UserRepository, User
from users.user_dto import UserDto

user_blueprint = Blueprint('user_update', __name__, url_prefix='/api')

user_repository = UserRepository()

@user_blueprint.route('/user', methods=['GET'])
@login_required
def get_user() -> tuple[Response, int]:
    user = user_repository.find_by_id(current_user._id)
    if not user:
        return create_response("userNotExist", 404)

    get_user_dto = UserDto.from_user(user)
    return create_response("userFetchSuccessful", 200, get_user_dto.to_dict())

def validate_user_field_data(user_data: dict) -> Optional[tuple[Response, int]]:
    if not user_data:
        return create_response("emptyRequestPayload", 400)

    valid_fields = {'login', 'account_name', 'currency'}
    invalid_fields = [field for field in user_data if field not in valid_fields]

    if invalid_fields:
        # Można zrobić tak i wtedy będzie zwracać wszystkie niepasujące pola
        # return create_response(f"invalidFields;{', '.join(invalid_fields)}", 400)
        return create_response(f"missingFields;{invalid_fields[0]}", 400)

    return None

@user_blueprint.route("/user/update", methods=['PATCH'])
@login_required
def update_user_field() -> tuple[Response, int]:
    user_data = request.json

    # Validate the request payload
    error = validate_user_field_data(user_data)
    if error:
        return error

    # Update user record
    try:
        user_repository.update(current_user._id, user_data)

        # Fetch the updated user record
        updated_user = user_repository.find_by_id(current_user._id)
        if not updated_user:
            return create_response("userUpdateNotFound", 404)

        updated_user_dto = UserDto.from_user(updated_user)
        return create_response("userUpdateSuccessful", 200, updated_user_dto.to_dict())
    except Exception as e:
        return create_response(f"errorUpdateUser;{str(e)}", 500)

def validate_password_change_request(data: dict) -> Optional[tuple[Response, int]]:
    if not data or 'current_password' not in data or 'new_password' not in data:
        return create_response("userPasswordRequiredFields", 400)
    return None

@user_blueprint.route("/user/password", methods=['PATCH'])
@login_required
def change_user_password() -> tuple[Response, int]:
    data = request.json

    # Validate the request payload
    error = validate_password_change_request(data)
    if error:
        return error

    current_password = data['current_password']
    new_password = data['new_password']

    # Retrieve the user and verify the password
    user: User = user_repository.find_by_id(current_user._id)
    if not user or not verify_password(user.password, current_password):
        return create_response("incorrectCurrentPassword", 401)

    # Hash the new password and update it
    try:
        hashed_new_password = hash_password(new_password)
        user_repository.update(current_user._id, {'password': hashed_new_password})
        return create_response("passwordUpdateSuccessful", 200)
    except Exception as e:
        return create_response(f"errorUpdatePassword;{str(e)}", 500)
