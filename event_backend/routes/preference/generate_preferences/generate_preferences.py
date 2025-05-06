from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences_repository import PreferencesRepository
from routes.helpers import validate_token
from routes.preference.generate_preferences.generate_auto_redirect_preferences import generate_auto_redirect_preferences
from routes.preference.generate_preferences.generate_next_step_preferences import generate_next_step_preferences
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

    preferences = prepare_preferences(user_obj_id)

    preferences.preferences['shortcutPreference'] = generate_shortcut_preferences(user_id)

    preferences.preferences['autoRedirectPreference'] = generate_auto_redirect_preferences(user_id)

    generate_next_step_preferences(user_id)

    generate_quick_icons_preferences(user_id, token_value)

    d = preferences.to_dict(for_db=True)
    d.pop('_id')
    preferences_repository.update(str(preferences.id), d)

    return create_simple_response("success", HTTPStatus.OK)
