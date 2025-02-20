from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetCardsResponse:

    @classmethod
    def create_response(cls, message: str, cards: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "cards": cards}), status)
        response.headers["Content-Type"] = "application/json"
        return response
