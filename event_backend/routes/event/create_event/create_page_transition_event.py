from http import HTTPStatus
from multiprocessing import Process

import bson
from flask import Response, request
from shared import create_simple_response

from page_transition_event.page_transition_event import PageTransitionEvent
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from page_transition_event.requests.create_page_transition_event_request import CreatePageTransitionEventRequest
from processes.pass_new_event_to_camunda import pass_new_event_to_camunda
from routes.helpers import validate_token

page_transition_event_repository = PageTransitionEventRepository()

def create_page_transition_event(user_id: str, data: dict) -> Response:
    error = CreatePageTransitionEventRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    page_transition_event = PageTransitionEvent(
        session_id=token_value,
        case_id=token_value,
        event_id=None,
        user_id=user_obj_id,
        start_timestamp=data.get('start_timestamp'),
        event_type=data.get('event_type'),
        page=data.get('page'),
        next_page=data.get('next_page'),
        time_spent=data.get('time_spent'),
        activity=data.get('event_type') + " " + data.get('next_page')
    )
    page_transition_event_repository.insert(page_transition_event)

    p = Process(target=pass_new_event_to_camunda, args=(page_transition_event.next_page, user_id))
    p.start()

    return create_simple_response("pageTransitionEventCreatedSuccessfully", HTTPStatus.CREATED)