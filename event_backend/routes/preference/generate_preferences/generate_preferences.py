from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from routes.helpers import validate_token
from routes.preference.generate_preferences.generate_next_step_preferences import generate_next_step_preferences
from routes.preference.generate_preferences.generate_quick_icons_preferences import generate_quick_icons_preferences
from routes.preference.generate_preferences.prepare_preferences import prepare_preferences


def generate_preferences(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    prepare_preferences(user_obj_id)

    generate_quick_icons_preferences(user_id, token_value)

    generate_next_step_preferences(user_id)

    return create_simple_response("noClickEventsFound", HTTPStatus.NOT_FOUND)