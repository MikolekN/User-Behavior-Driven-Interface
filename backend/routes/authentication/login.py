from http import HTTPStatus

import bson
from flask import Response, request
from flask_login import login_user
from shared import create_token

from routes.authentication.helpers import authenticate_user
from routes.helpers import create_simple_response, unauthenticated_required
from users.requests.login_request import LoginRequest


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

    create_token(bson.ObjectId(user.id))

    return create_simple_response("loginSuccessful", HTTPStatus.OK)