from dataclasses import dataclass
from http import HTTPStatus

from flask import Response, make_response, jsonify


@dataclass
class GetNextStepResponse:

    @classmethod
    def create_response(cls, message: str, next_step: dict, status: HTTPStatus) -> Response:
        response = make_response(jsonify({"message": message, "next_step": next_step}), status)
        response.headers["Content-Type"] = "application/json"
        return response
