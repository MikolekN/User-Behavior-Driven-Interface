from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetTransfersResponseDto:

    @classmethod
    def create_response(cls, message: str, transactions: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "transactions": transactions}), status)
        response.headers["Content-Type"] = "application/json"
        return response
