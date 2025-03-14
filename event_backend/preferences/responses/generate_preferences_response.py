from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GeneratePreferencesResponse:

    @classmethod
    def create_response(cls, message: str, preferences: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "preferences": preferences}), status)
        response.headers["Content-Type"] = "application/json"
        return response
