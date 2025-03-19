from http import HTTPStatus

from flask import Response, request
from shared import create_simple_response

from base_create_event_request import BaseCreateEventRequest
from routes.create_event.create_click_event import create_click_event
from routes.create_event.create_page_transition_event import create_page_transition_event


def create_event(user_id) -> Response:
    data = request.get_json()

    error = BaseCreateEventRequest._validate_request(BaseCreateEventRequest, data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    match data['event_type']:
        case 'click_event':
            return create_click_event(user_id, data)
        case 'page_transition_event':
            return create_page_transition_event(user_id, data)
        case _:
            return create_simple_response('wrong event type', HTTPStatus.BAD_REQUEST)
