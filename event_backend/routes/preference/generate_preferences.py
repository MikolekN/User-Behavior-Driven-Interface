from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event_repository import ClickEventRepository
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from preferences.preferences import Preferences
from preferences.preferences_repository import PreferencesRepository
from preferences.responses.generate_preferences_response import GeneratePreferencesResponse
from routes.helpers import validate_token

preferences_repository = PreferencesRepository()
click_events_repository = ClickEventRepository()
page_transition_event_repository = PageTransitionEventRepository()

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
                "quickIconsPreference": "quick-icons-settings",
                "pageTransitionPreference": []
            }
        )
        preferences_repository.insert(preferences)
    else:
        preferences.preferences['quickIconsPreference'] = click_events_repository.get_user_quick_icons_preference(user_id)
        preferences.preferences['pageTransitionPreference'] = page_transition_event_repository.get_user_page_transition_preference(user_id)
        d = preferences.to_dict(for_db=True)
        d.pop('_id')
        preferences_repository.update(str(preferences.id), d)

    return GeneratePreferencesResponse.create_response("preferencesGenerateSuccessful", preferences.to_dict(), HTTPStatus.OK)