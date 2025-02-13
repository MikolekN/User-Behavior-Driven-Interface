import os
from http import HTTPStatus

from flask import Response, send_file
from flask_login import login_required, current_user

from routes.helpers import create_simple_response
from users import User, UserRepository

user_repository = UserRepository()

@login_required
def get_user_icon() -> Response:
    user_data, icon_path = get_user_data_and_icon_path(current_user.get_id())
    if not user_data or not icon_path:
        return create_simple_response("iconNotSetForUser", HTTPStatus.NOT_FOUND)

    is_valid, error_message = validate_icon_path(icon_path)
    if not is_valid:
        return create_simple_response(error_message, HTTPStatus.NOT_FOUND)

    try:
        return send_file(icon_path, mimetype='image/png')
    except Exception as e:
        return create_simple_response(f"sendIconFailed;{str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)

# TODO: separate for two different messages
def get_user_data_and_icon_path(user_id: str) -> tuple[dict | None, str | None]:
    user_data: User = user_repository.find_by_id(user_id)
    if not user_data or not user_data.user_icon:
        return None, None
    return user_data.to_dict(), user_data.user_icon

def validate_icon_path(icon_path: str) -> tuple[bool, str | None]:
    if not os.path.exists(icon_path):
        return False, "iconNotFound"
    return True, None
