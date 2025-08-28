from abc import ABC, abstractmethod
from dataclasses import asdict, field, dataclass
from datetime import datetime
from typing import Dict, Any, Optional

import bson


@dataclass
class BaseEntity(ABC):
    _id: Optional[bson.ObjectId] = field(default_factory=bson.ObjectId)
    created: Optional[datetime] = field(default_factory=datetime.now)
    is_deleted: bool = field(default=False)

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        entity_dict = asdict(self)
        if self._id:
            entity_dict['_id'] = self._id if for_db else str(self._id)
        if self.created:
            entity_dict['created'] = self.created if for_db else self.created.isoformat()
        return entity_dict

    @staticmethod
    @abstractmethod
    def from_dict(data: Dict[str, Any]) -> 'BaseEntity':
        pass

    @property
    def id(self) -> bson.ObjectId:
        return self._id
