from http import HTTPStatus

from flask import Response, request
from flask_login import login_user

from routes.authentication.helpers import validate_login_data, authenticate_user
from routes.helpers import create_simple_response, unauthenticated_required
from users.user_dto import UserDto
from users.user_response import UserResponse


@unauthenticated_required
def login() -> Response:
    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user, error, status_code = authenticate_user(data['email'], data['password'])
    if user is None:
        return create_simple_response(error, status_code)

    login_user(user)
    user_dto = UserDto.from_user(user)
    return UserResponse.create_response("loginSuccessful", user_dto.to_dict(), HTTPStatus.OK)