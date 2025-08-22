from typing import Optional, Type

import bson
from shared import BaseRepository

from models.model import Model


class ModelRepository(BaseRepository):
    COLLECTION: str = 'Models'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Model]:
        return Model

    def find_by_user(self, user_id: bson.ObjectId) -> Optional[Model]:
        return super().find_by_field('user_id', user_id)