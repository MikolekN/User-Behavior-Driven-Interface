from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class HistoryResponse:

    @classmethod
    def create_response(cls, message: str, history: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "transfers": history}), status)
        response.headers["Content-Type"] = "application/json"
        return response
