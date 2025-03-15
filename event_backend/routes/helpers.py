from http import HTTPStatus
from typing import Optional

import bson
from flask import Response
from shared import create_simple_response, Token, TokenRepository

token_repository = TokenRepository()

def validate_token(token_value: str, user_obj_id: bson.ObjectId) -> Optional[Response]:
    if not token_value:
        return create_simple_response("missingToken", HTTPStatus.UNAUTHORIZED)

    token: Token = token_repository.find_by_user(user_obj_id)
    if not token:
        return create_simple_response("token not exist", HTTPStatus.NOT_FOUND)

    if token.token != token_value:
        return create_simple_response("wrong token", HTTPStatus.BAD_REQUEST)

    return None
