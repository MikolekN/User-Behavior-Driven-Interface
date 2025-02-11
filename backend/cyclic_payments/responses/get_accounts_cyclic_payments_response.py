from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetAccountsCyclicPaymentsResponse:

    @classmethod
    def create_response(cls, message: str, cyclic_payments: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "cyclic_payments": cyclic_payments}), status)
        response.headers["Content-Type"] = "application/json"
        return response
