from dataclasses import dataclass

from flask import jsonify, Response


@dataclass
class AnalysisResponse:

    @classmethod
    def create_response(cls, message: str, analysis: list[dict], status_code: int) -> tuple[Response, int]:
        response = {
            "message": message,
            "transfers": analysis
        }
        return jsonify(response), status_code
