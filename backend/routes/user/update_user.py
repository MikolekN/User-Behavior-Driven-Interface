from http import HTTPStatus

from flask import request, Response
from flask_login import login_required, current_user, logout_user

from routes.helpers import create_simple_response, verify_password, hash_password
from users import User, UserRepository
from users.requests.update_user_request import UpdateUserRequest
from users.responses.update_user_response import UpdateUserResponse

user_repository = UserRepository()

@login_required
def update_user() -> Response:
    data = request.json

    error = UpdateUserRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    result = None
    for field in data:
        match field:
            case 'login':
                result = update_login(data['login'])
            case 'new_password':
                result = update_password(data['current_password'], data['new_password'])
    if isinstance(result, Response):
        return result
    elif isinstance(result, User):
        if 'new_password' in data:
            logout_user()
        return UpdateUserResponse.create_response("userUpdateSuccessful", result.to_dict(), HTTPStatus.OK)

def update_login(login: str) -> Response | User:
    login_data = {'login': login}
    try:
        updated_user: User = user_repository.update(str(current_user.id), login_data)
        if not updated_user:
            return create_simple_response("userUpdateNotFound", HTTPStatus.NOT_FOUND)
        return updated_user
    except Exception as e:
        return create_simple_response(f"errorUpdateUser;{str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)

def update_password(current_password: str, new_password: str) -> Response | User:
    user: User = user_repository.find_by_id(current_user.get_id())
    if not user or not verify_password(user.password, current_password):
        return create_simple_response("incorrectCurrentPassword", HTTPStatus.UNAUTHORIZED)

    try:
        hashed_new_password = hash_password(new_password)
        updated_user: User = user_repository.update(current_user.get_id(), {'password': hashed_new_password})
        if not updated_user:
            return create_simple_response("userUpdateNotFound", HTTPStatus.NOT_FOUND)
        return updated_user
    except Exception as e:
        return create_simple_response(f"errorUpdatePassword;{str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)