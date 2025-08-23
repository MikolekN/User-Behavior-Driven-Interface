from http import HTTPStatus

import bson
from flask import Response, request
from shared import create_simple_response

from models.model_repository import ModelRepository
from processes.run_process_instance import create_process_instance
from routes.helpers import validate_token

model_repository = ModelRepository()


async def run_process_instance(user_id: str) -> Response:
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUser", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    token_value = request.headers.get("Authorization")
    invalid = validate_token(token_value, user_obj_id)
    if invalid:
        return invalid

    process_instance_definition = await create_process_instance(user_id)
    if not process_instance_definition:
        return create_simple_response("processInstanceNotCreated", HTTPStatus.BAD_REQUEST)

    return create_simple_response("ok", HTTPStatus.CREATED)
