from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class GetAccountsResponse:

    @classmethod
    def create_response(cls, message: str, accounts: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "accounts": accounts}), status)
        response.headers["Content-Type"] = "application/json"
        return response
