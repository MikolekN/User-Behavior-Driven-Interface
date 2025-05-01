from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from hover_events.hover_event import HoverEvent
from hover_events.hover_event_repository import HoverEventRepository
from hover_events.requests.create_hover_event_request import CreateHoverEventRequest
from routes.helpers import validate_token

hover_event_repository = HoverEventRepository()

def create_hover_event(user_id: str, data: dict) -> Response:
    error = CreateHoverEventRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    hover_event = HoverEvent(
        session_id=token_value,
        case_id=token_value,
        event_id=None,
        user_id=user_obj_id,
        start_timestamp=data.get('start_timestamp'),
        event_type=data.get('event_type'),
        page=data.get('page'),
        element_id=data.get('element_id'),
        end_timestamp=data.get('end_timestamp'),
        duration=data.get('duration'),
    )
    hover_event_repository.insert(hover_event)

    return create_simple_response("hoverEventCreatedSuccessfully", HTTPStatus.CREATED)