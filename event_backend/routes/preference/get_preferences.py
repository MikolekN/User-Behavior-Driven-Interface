from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences_repository import PreferencesRepository
from preferences.responses.get_preferences_response import GetPreferencesResponse
from routes.helpers import validate_token

preferences_repository = PreferencesRepository()


def get_preferences(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    preferences = preferences_repository.find_by_user(user_obj_id)
    if not preferences:
        return create_simple_response("noPreferences", HTTPStatus.NOT_FOUND)

    return GetPreferencesResponse.create_response("preferencesFetchSuccessful", preferences.to_dict(), HTTPStatus.OK)
