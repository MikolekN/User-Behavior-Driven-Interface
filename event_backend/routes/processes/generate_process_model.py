from http import HTTPStatus
from multiprocessing import Process

import bson
from flask import Response, request
from shared import create_simple_response

from models.model_repository import ModelRepository
from processes.discover_process_model import discover_process_model
from routes.helpers import validate_token

model_repository = ModelRepository()


def generate_process_model(user_id: str) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    p = Process(target=discover_process_model, args=(user_id,))
    p.start()

    return create_simple_response("ok", HTTPStatus.CREATED)
