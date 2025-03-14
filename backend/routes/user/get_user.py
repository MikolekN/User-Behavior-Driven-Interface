from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user
from shared import TokenRepository

from routes.helpers import create_simple_response
from users import UserRepository
from users.responses.get_user_response import GetUserResponse

user_repository = UserRepository()
token_repository = TokenRepository()

@login_required
def get_user() -> Response:
    user = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)

    response = user.to_dict()

    token = token_repository.find_by_id(str(user.id))
    if token:
        response['token'] = token.token
        
    return GetUserResponse.create_response("userFetchSuccessful", response, HTTPStatus.OK)