from http import HTTPStatus

from flask import Response, request

from routes.authentication.helpers import validate_login_data
from routes.helpers import create_simple_response, hash_password, unauthenticated_required
from users import UserRepository, User
from users.user_dto import UserDto
from users.user_response import UserResponse

user_repository = UserRepository()

@unauthenticated_required
def register() -> Response:
    data = request.get_json()

    error = validate_login_data(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if user_repository.find_by_email(data['email']):
        return create_simple_response("userExist", HTTPStatus.CONFLICT)

    # TODO: Separate user creation logic from register endpoint
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
    return UserResponse.create_response("registerSuccessful", user_dto.to_dict(), HTTPStatus.CREATED)
