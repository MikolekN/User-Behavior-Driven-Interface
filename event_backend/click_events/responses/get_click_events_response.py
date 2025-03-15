from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetClickEventsResponse:

    @classmethod
    def create_response(cls, message: str, click_events: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "click_events": click_events}), status)
        response.headers["Content-Type"] = "application/json"
        return response
