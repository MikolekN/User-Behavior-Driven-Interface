from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetCardResponse:

    @classmethod
    def create_response(cls, message: str, card: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "card": card}), status)
        response.headers["Content-Type"] = "application/json"
        return response
