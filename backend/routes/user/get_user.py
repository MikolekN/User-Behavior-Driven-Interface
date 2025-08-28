from http import HTTPStatus

import bson
from flask import Response
from flask_login import login_required, current_user
from shared import get_token

from routes.helpers import create_simple_response
from users import UserRepository
from users.responses.get_user_response import GetUserResponse

user_repository = UserRepository()


@login_required
def get_user() -> Response:
    user = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    response = user.to_dict()

    token = get_token(bson.ObjectId(user.id))
    if token:
        response['token'] = token.token

    return GetUserResponse.create_response("userFetchSuccessful", response, HTTPStatus.OK)
