from http import HTTPStatus

from flask import Response
from flask_login import login_required, logout_user

from routes.helpers import create_simple_response


@login_required
def logout() -> Response:
    logout_user()
    return create_simple_response("logoutSuccessful", HTTPStatus.OK)
