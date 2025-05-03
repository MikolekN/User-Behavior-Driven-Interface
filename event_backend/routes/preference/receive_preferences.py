from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event_repository import ClickEventRepository
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from preferences.preferences_repository import PreferencesRepository

preferences_repository = PreferencesRepository()
click_events_repository = ClickEventRepository()
page_transition_event_repository = PageTransitionEventRepository()

def receive_preferences(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    data = request.get_json()
    preferences = preferences_repository.find_by_user(user_obj_id)
    preferences.preferences['quickIconsPreference'] = data['result']
    d = preferences.to_dict(for_db=True)
    d.pop('_id')
    preferences_repository.update(str(preferences.id), d)

    return create_simple_response("ok", HTTPStatus.OK)