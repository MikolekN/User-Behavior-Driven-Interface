from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetSettingsResponse:

    @classmethod
    def create_response(cls, message: str, settings: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "settings": settings}), status)
        response.headers["Content-Type"] = "application/json"
        return response
