from http import HTTPStatus

from flask import Response, jsonify, make_response


def create_simple_response(message: str, status: HTTPStatus) -> Response:
    response = make_response(jsonify({"message": message}), status)
    response.headers["Content-Type"] = "application/json"
    return response
