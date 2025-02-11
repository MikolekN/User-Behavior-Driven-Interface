from http import HTTPStatus

from flask import Response
from flask_login import login_required, current_user

from routes.helpers import create_simple_response
from users import UserRepository
from users.responses.get_user_response import GetUserResponse

user_repository = UserRepository()

@login_required
def get_user() -> Response:
    user = user_repository.find_by_id(current_user.get_id())
    if not user:
        return create_simple_response("userNotExist", HTTPStatus.NOT_FOUND)
    return GetUserResponse.create_response("userFetchSuccessful", user.to_dict(), HTTPStatus.OK)