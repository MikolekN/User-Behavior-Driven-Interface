from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event_repository import ClickEventRepository
from click_events.responses.get_click_events_response import GetClickEventsResponse
from routes.helpers import validate_token

click_event_repository = ClickEventRepository()

def get_events(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    query = {
        "user_id": user_obj_id,
        "event_type": "click_event"
    }
    sort_criteria = [("start_timestamp", 1)]
    events = click_event_repository.find_many(query, sort_criteria)

    if not events:
        return create_simple_response("noEvents", HTTPStatus.NOT_FOUND)
    events_dto = [event.to_dict() for event in events]

    return GetClickEventsResponse.create_response("clickEventsFetchSuccessful", events_dto, HTTPStatus.OK)