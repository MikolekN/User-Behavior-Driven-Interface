from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetUserResponse:

    @classmethod
    def create_response(cls, message: str, user: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "user": user}), status)
        response.headers["Content-Type"] = "application/json"
        return response
