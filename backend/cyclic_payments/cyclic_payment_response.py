from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class CyclicPaymentResponse:

    @classmethod
    def create_response(cls, message: str, cyclic_payment: dict, status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "cyclic_payment": cyclic_payment
        }
        return jsonify(response), status_code
