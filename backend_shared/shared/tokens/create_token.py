import bson
import secrets

from .token import Token
from .token_repository import TokenRepository

token_repository = TokenRepository()


def create_token(user_id: bson.ObjectId) -> None:
    token = Token(
        user_id=user_id,
        token=secrets.token_hex(32)
    )
    token_repository.insert(token)
