from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class HistoryResponse:

    @classmethod
    def create_response(cls, message: str, history: list[dict], status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "transfers": history
        }
        return jsonify(response), status_code
