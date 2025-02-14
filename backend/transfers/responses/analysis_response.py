from dataclasses import dataclass
from http import HTTPStatus

from flask import jsonify, Response, make_response


@dataclass
class AnalysisResponse:

    @classmethod
    def create_response(cls, message: str, analysis: list[dict], status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "transfers": analysis}), status)
        response.headers["Content-Type"] = "application/json"
        return response
