from typing import Type, Optional

import bson
from shared import BaseRepository

from tokens.token import Token


class TokenRepository(BaseRepository):
    COLLECTION: str = 'Tokens'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Token]:
        return Token

    def find_by_user(self, user_id: bson.ObjectId) -> Optional[Token]:
        return super().find_by_field('user_id', user_id)
