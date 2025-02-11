from http import HTTPStatus

from flask import Response, request

from routes.helpers import create_simple_response, hash_password, unauthenticated_required
from users import UserRepository, User
from users.requests.register_request import RegisterRequest

user_repository = UserRepository()

@unauthenticated_required
def register() -> Response:
    data = request.get_json()

    error = RegisterRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if user_repository.find_by_email(data['email']):
        return create_simple_response("userExist", HTTPStatus.CONFLICT)

    # TODO: Separate user creation logic from register endpoint
    user = User(
        login=data['email'],
        email=data['email'],
        password=hash_password(data['password']),
        role='USER',
        user_icon=None
    )
    user_repository.insert(user)

    return create_simple_response("registerSuccessful", HTTPStatus.CREATED)
