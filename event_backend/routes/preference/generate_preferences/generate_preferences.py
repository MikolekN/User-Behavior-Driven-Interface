from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences_repository import PreferencesRepository
from preferences.requests.generate_menu_priority_request import GenerateMenuPriorityRequest
from routes.helpers import validate_token
from routes.preference.generate_preferences.generate_auto_redirect_preferences import generate_auto_redirect_preferences
from routes.preference.generate_preferences.generate_menu_priority_preferences import generate_menu_priority_preferences
from routes.preference.generate_preferences.generate_quick_icons_preferences import generate_quick_icons_preferences
from routes.preference.generate_preferences.generate_shortcut_preferences import generate_shortcut_preferences
from routes.preference.generate_preferences.prepare_preferences import prepare_preferences

preferences_repository = PreferencesRepository()


def generate_preferences(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    data = request.get_json()
    error = GenerateMenuPriorityRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    preferences = prepare_preferences(user_obj_id)

    preferences.preferences['shortcutPreference'] = generate_shortcut_preferences(user_id)

    preferences.preferences['autoRedirectPreference'] = generate_auto_redirect_preferences(user_id)
    preferences.preferences['autoRedirectPreference']["transferForm"] = "/transactions/history"

    preferences.preferences['quickIconsPreference'] = generate_quick_icons_preferences(user_id)

    preferences.preferences['menuPriorityPreference'] = generate_menu_priority_preferences(user_id, data)

    d = preferences.to_dict(for_db=True)
    d.pop('_id')
    preferences_repository.update(str(preferences.id), d)

    return create_simple_response("success", HTTPStatus.OK)
