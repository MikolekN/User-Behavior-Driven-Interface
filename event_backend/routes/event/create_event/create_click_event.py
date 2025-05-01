from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from click_events.requests.create_click_event_request import CreateClickEventRequest
from routes.helpers import validate_token


click_event_repository = ClickEventRepository()

def create_click_event(user_id: str, data: dict) -> Response:
    error = CreateClickEventRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    click_event = ClickEvent(
        session_id=token_value,
        case_id=token_value,
        event_id=None,
        user_id=user_obj_id,
        start_timestamp=data.get('start_timestamp'),
        event_type=data.get('event_type'),
        page=data.get('page'),
        element_id=data.get('element_id'),
        from_dropdown=data.get('from_dropdown')
    )
    click_event_repository.insert(click_event)

    return create_simple_response("clickEventCreatedSuccessfully", HTTPStatus.CREATED)