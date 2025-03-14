from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences import Preferences
from preferences.preferences_repository import PreferencesRepository
from preferences.requests.generate_preferences_request import GeneratePreferencesRequest
from preferences.responses.generate_preferences_response import GeneratePreferencesResponse
from shared import Token
from shared import TokenRepository

preferences_repository = PreferencesRepository()
token_repository = TokenRepository()

def generate_preferences() -> Response:
    data = request.get_json()

    error = GeneratePreferencesRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    token: Token = token_repository.find_by_user(data.get("user_id"))
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != data.get("token"):
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

    preferences = preferences_repository.find_by_user(bson.ObjectId(data.get("user_id")))
    if not preferences:
        preferences: Preferences = Preferences(
            user_id=data.get("user_id"),
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