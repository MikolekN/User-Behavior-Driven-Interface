from http import HTTPStatus

import bson
from flask import Response, request

from routes.helpers import create_simple_response, hash_password, unauthenticated_required
from settings.generate_settings import generate_default_settings
from users import UserRepository, User
from users.requests.register_request import RegisterRequest

user_repository = UserRepository()


@unauthenticated_required
def register() -> Response:
    data = request.get_json()

    error = RegisterRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if user_repository.find_by_email_full(data['email']):
        return create_simple_response("userExist", HTTPStatus.CONFLICT)

    user = User(
        login=data['email'],
        email=data['email'],
        password=hash_password(data['password']),
        role='USER',
        user_icon=None
    )
    saved_user = user_repository.insert(user)

    generate_default_settings(bson.ObjectId(saved_user.id))

    return create_simple_response("registerSuccessful", HTTPStatus.CREATED)
