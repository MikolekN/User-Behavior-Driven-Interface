from dataclasses import dataclass
from typing import Optional, Dict, Any

import bson
from shared import BaseEntity


@dataclass
class Token(BaseEntity):
    token: Optional[str] = None
    user_id: Optional[bson.ObjectId] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        token_dict = super().to_dict(for_db)
        if self.user_id:
            token_dict['user_id'] = self.user_id if for_db else str(self.user_id)
        return token_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Token':
        return Token(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data.get('created', None),
            is_deleted=data.get('is_deleted', False),
            token=data.get('token', None),
            user_id=data.get('user_id', None),
        )
