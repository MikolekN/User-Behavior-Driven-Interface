from typing import Type, Optional

import bson
from shared import BaseRepository

from settings.settings import Settings


class SettingsRepository(BaseRepository):
    COLLECTION: str = 'Settings'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Settings]:
        return Settings

    def find_by_user(self, user_id: bson.ObjectId) -> Optional[Settings]:
        return super().find_by_field('user_id', user_id)
