from http import HTTPStatus

from flask import Response, request

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from click_events.requests.create_click_event_request import CreateClickEventRequest
from shared import create_simple_response
from shared import Token
from shared import TokenRepository

token_repository = TokenRepository()
click_event_repository = ClickEventRepository()

def create_event() -> Response:
    data = request.get_json()

    error = CreateClickEventRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    token: Token = token_repository.find_by_user(data.get("user_id"))
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != data.get("token"):
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

    click_event = ClickEvent(
        session_id=None,
        case_id=None,
        event_id=None,
        user_id=data.get('user_id'),
        start_timestamp=data.get('start_timestamp'),
        event_type=data.get('event_type'),
        page=data.get('page'),
        element_id=data.get('element_id'),
        from_dropdown=data.get('from_dropdown')
    )
    click_event_repository.insert(click_event)

    return create_simple_response("clickEventCreatedSuccessfully", HTTPStatus.CREATED)