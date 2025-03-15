from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences import Preferences
from preferences.preferences_repository import PreferencesRepository
from preferences.responses.generate_preferences_response import GeneratePreferencesResponse
from routes.helpers import validate_token

preferences_repository = PreferencesRepository()

def generate_preferences(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    preferences = preferences_repository.find_by_user(user_obj_id)
    if not preferences:
        preferences: Preferences = Preferences(
            user_id=user_obj_id,
            preferences={
                "quickIconsPreference": "quick-icons-settings"
            }
        )
        preferences_repository.insert(preferences)
    else:
        preferences.preferences['quickIconsPreference'] = "quick-icons-settings"
        d = preferences.to_dict(for_db=True)
        d.pop('_id')
        preferences_repository.update(str(preferences.id), d)

    return GeneratePreferencesResponse.create_response("preferencesGenerateSuccessful", preferences.to_dict(), HTTPStatus.OK)