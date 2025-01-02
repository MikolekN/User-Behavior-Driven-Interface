from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class UserCyclicPaymentsResponse:

    @classmethod
    def create_response(cls, message: str, cyclic_payments: list[dict], status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "cyclic_payments": cyclic_payments
        }
        return jsonify(response), status_code
