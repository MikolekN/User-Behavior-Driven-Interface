from typing import Type, Optional

import bson
from shared import BaseRepository

from preferences.preferences import Preferences


class PreferencesRepository(BaseRepository):
    COLLECTION: str = 'Preferences'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[Preferences]:
        return Preferences

    def find_by_user(self, user_id: bson.ObjectId) -> Optional[Preferences]:
        return super().find_by_field('user_id', user_id)
