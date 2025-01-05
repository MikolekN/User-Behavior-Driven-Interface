from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class AccountsResponse:

    @classmethod
    def create_response(cls, message: str, account: list[dict], status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "account": account
        }
        return jsonify(response), status_code