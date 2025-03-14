from http import HTTPStatus

from flask import Response, request
from flask_login import login_user
from shared import Token, TokenRepository, generate_token

from routes.authentication.helpers import authenticate_user
from routes.helpers import create_simple_response, unauthenticated_required
from users.requests.login_request import LoginRequest

token_repository = TokenRepository()

@unauthenticated_required
def login() -> Response:
    data = request.get_json()

    error = LoginRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user, error, status_code = authenticate_user(data['email'], data['password'])
    if user is None:
        return create_simple_response(error, status_code)

    login_user(user)

    token: Token = Token(
        user_id=user.id,
        token=generate_token()
    )
    token_repository.insert(token)

    return create_simple_response("loginSuccessful", HTTPStatus.OK)