from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetAccountResponse:

    @classmethod
    def create_response(cls, message: str, account: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "account": account}), status)
        response.headers["Content-Type"] = "application/json"
        return response
