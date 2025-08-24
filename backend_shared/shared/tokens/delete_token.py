import bson
from .token_repository import TokenRepository


token_repository = TokenRepository()
def delete_token(user_id: bson.ObjectId) -> None:
    token = token_repository.find_by_user(user_id)
    if token:
        token_repository.delete(str(token.id))
