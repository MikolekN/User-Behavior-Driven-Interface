from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event_repository import ClickEventRepository
from click_events.responses.get_click_events_response import GetClickEventsResponse
from shared import Token
from shared import TokenRepository

click_event_repository = ClickEventRepository()
token_repository = TokenRepository()

def get_events(user_id) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    if not token_value:
        return create_simple_response("missingToken", HTTPStatus.UNAUTHORIZED)

    token: Token = token_repository.find_by_user(user_obj_id)
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != token_value:
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

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