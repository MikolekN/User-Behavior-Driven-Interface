from dataclasses import dataclass
from typing import Dict, Any, Optional

import bson
from shared import BaseEntity


@dataclass
class Model(BaseEntity):
    model_id: Optional[str] = None
    new_model_id: Optional[str] = None
    user_id: Optional[bson.ObjectId] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        model_dict = super().to_dict(for_db)
        if self.user_id:
            model_dict['user_id'] = self.user_id if for_db else str(self.user_id)
        return model_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Model':
        return Model(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data.get('created', None),
            is_deleted=data.get('is_deleted', False),
            model_id=data.get('model_id', None),
            new_model_id=data.get('new_model_id', None),
            user_id=data.get('user_id', None)
        )
