from dataclasses import dataclass
from typing import Any, Dict, Optional

import bson
from shared import BaseEntity


@dataclass
class Settings(BaseEntity):
    settings: Optional[Dict[str, Any]] = None
    user_id: Optional[bson.ObjectId] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        settings_dict = super().to_dict(for_db)
        if self.user_id:
            settings_dict['user_id'] = self.user_id if for_db else str(self.user_id)
        return settings_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Settings':
        return Settings(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data.get('created', None),
            is_deleted=data.get('is_deleted', False),
            settings=data.get('settings', None),
            user_id=data.get('user_id', None),
        )
