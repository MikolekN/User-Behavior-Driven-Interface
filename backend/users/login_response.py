from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class LoginResponse:

    @classmethod
    def create_response(cls, message: str, user: dict, status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "user": user
        }
        return jsonify(response), status_code
