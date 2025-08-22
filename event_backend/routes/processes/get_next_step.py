from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from models.model_repository import ModelRepository
from processes.generate_next_step import generate_next_step
from processes.responses.get_next_step_response import GetNextStepResponse
from routes.helpers import validate_token

model_repository = ModelRepository()

def get_next_step(user_id: str) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    step = generate_next_step(user_id)
    if not step:
        return create_simple_response("invalidStep", HTTPStatus.INTERNAL_SERVER_ERROR)

    return GetNextStepResponse.create_response("ok", step.to_dict(), HTTPStatus.OK)
