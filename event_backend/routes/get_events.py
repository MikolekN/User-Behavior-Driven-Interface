from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event_repository import ClickEventRepository
from click_events.requests.get_click_events_request import GetClickEventsRequest
from click_events.responses.get_click_events_response import GetClickEventsResponse
from tokens.token import Token
from tokens.token_repository import TokenRepository

click_event_repository = ClickEventRepository()
token_repository = TokenRepository()

def get_events() -> Response:
    data = request.get_json()

    error = GetClickEventsRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    token: Token = token_repository.find_by_user(data.get("user_id"))
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != data.get("token"):
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

    query = {
        "user_id": bson.ObjectId(data.get("user_id")),
        "event_type": "click_event"
    }
    sort_criteria = [("start_timestamp", 1)]
    events = click_event_repository.find_many(query, sort_criteria)
    if not events:
        return create_simple_response("noEvents", HTTPStatus.NOT_FOUND)
    events_dto = [event.to_dict() for event in events]

    return GetClickEventsResponse.create_response("clickEventsFetchSuccessful", events_dto, HTTPStatus.OK)