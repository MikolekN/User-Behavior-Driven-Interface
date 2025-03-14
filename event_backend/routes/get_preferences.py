from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from preferences.preferences_repository import PreferencesRepository
from preferences.requests.get_preferenes_request import GetPreferencesRequest
from preferences.responses.get_preferences_response import GetPreferencesResponse
from shared import Token
from shared import TokenRepository

preferences_repository = PreferencesRepository()
token_repository = TokenRepository()

def get_preferences() -> Response:
    data = request.get_json()

    error = GetPreferencesRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    token: Token = token_repository.find_by_user(data.get("user_id"))
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != data.get("token"):
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

    preferences = preferences_repository.find_by_user(bson.ObjectId(data.get("user_id")))
    if not preferences:
        return create_simple_response("noPreferences", HTTPStatus.NOT_FOUND)

    return GetPreferencesResponse.create_response("preferencesFetchSuccessful", preferences.to_dict(), HTTPStatus.OK)