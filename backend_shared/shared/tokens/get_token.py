from typing import Optional

import bson

from .token import Token
from .token_repository import TokenRepository

token_repository = TokenRepository()

def get_token(user_id: bson.ObjectId) -> Optional[Token]:
    token = token_repository.find_by_id(str(user_id))
    if token:
        return token
