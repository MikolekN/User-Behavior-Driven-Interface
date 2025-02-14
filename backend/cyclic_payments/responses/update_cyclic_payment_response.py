from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class UpdateCyclicPaymentResponse:

    @classmethod
    def create_response(cls, message: str, cyclic_payment: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "cyclic_payment": cyclic_payment}), status)
        response.headers["Content-Type"] = "application/json"
        return response
