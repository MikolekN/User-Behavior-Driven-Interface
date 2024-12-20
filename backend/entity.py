from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dataclasses import asdict, field, dataclass
from datetime import datetime
import bson

@dataclass
class BaseEntity(ABC):
    _id: Optional[bson.ObjectId] = None
    created: Optional[datetime] = field(default_factory=datetime.now)

    def to_dict(self) -> Dict[str, Any]:
        entity_dict = asdict(self)
        if self._id is None:
            entity_dict.pop('_id', None)
        else:
            entity_dict['_id'] = str(self._id)
        if self.created:
            entity_dict['created'] = self.created.isoformat()
        return entity_dict

    @staticmethod
    @abstractmethod
    def from_dict(data: Dict[str, Any]) -> 'BaseEntity':
        pass

    def get_id(self) -> str:
        return str(self._id) if self._id else ""

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(_id={self._id}, created={self.created})"
