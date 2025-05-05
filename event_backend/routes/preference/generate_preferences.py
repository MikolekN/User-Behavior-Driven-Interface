import json
from http import HTTPStatus
from typing import Optional

import bson
import requests
from flask import Response, request
from shared import create_simple_response

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from config import CAMUNDA_URL
from preferences.preferences_service import PreferencesService
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from page_transition_event.constants import BASE_QUICK_ICONS_PREFERENCE
from preferences.preferences import Preferences
from preferences.preferences_repository import PreferencesRepository
from routes.helpers import validate_token

preferences_repository = PreferencesRepository()
click_event_repository = ClickEventRepository()
page_transition_event_repository = PageTransitionEventRepository()
preferences_service = PreferencesService(click_event_repository, page_transition_event_repository)

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
                "quickIconsPreference": BASE_QUICK_ICONS_PREFERENCE,
                "pageTransitionPreference": [],
                "autoRedirectPreferences": {}
            }
        )
        preferences_repository.insert(preferences)
    else:
        preferences.preferences['pageTransitionPreference'] = page_transition_event_repository.get_user_page_transition_preference(user_id)
        preferences.preferences['autoRedirectPreference'] = preferences_service.get_user_auto_redirect_preferences(user_id)
        d = preferences.to_dict(for_db=True)
        d.pop('_id')
        preferences_repository.update(str(preferences.id), d)
    

    click_events: Optional[list[ClickEvent]] = click_event_repository.get_user_quick_icons_events(user_id)
    if click_events:
        requests.post(
            CAMUNDA_URL,
            data=json.dumps({
                "user_id": user_id,
                "token": token_value,
                "events": [click_event.to_dict() for click_event in click_events]
            })
        )
        return create_simple_response("ok", HTTPStatus.OK)

    return create_simple_response("noClickEventsFound", HTTPStatus.NOT_FOUND)