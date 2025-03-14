from http import HTTPStatus

import bson
from flask import Response
from flask_login import login_required, logout_user, current_user
from shared import TokenRepository

from routes.helpers import create_simple_response


token_repository = TokenRepository()

@login_required
def logout() -> Response:
    token = token_repository.find_by_user(bson.ObjectId(current_user.get_id()))
    if token:
        token_repository.delete(str(token.id))

    logout_user()
    return create_simple_response("logoutSuccessful", HTTPStatus.OK)
