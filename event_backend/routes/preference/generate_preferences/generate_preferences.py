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

    preferences = preferences_repository.find_by_user(user_obj_id)
    if not preferences:
        preferences: Preferences = Preferences(
            user_id=user_obj_id,
            preferences={
                "quickIconsPreference": BASE_QUICK_ICONS_PREFERENCE,
                "pageTransitionPreference": [],
                "autoRedirectPreferences": DEFAULT_AUTO_REDIRECT_PREFERENCE
            }
        )
        preferences_repository.insert(preferences)
    else: # sprawdzić czy ten else jest tutaj potrzebny
        preferences.preferences['pageTransitionPreference'] = page_transition_event_repository.get_user_page_transition_preference(user_id)
        preferences.preferences['autoRedirectPreference'] = generate_auto_redirect_preferences(user_id)
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
