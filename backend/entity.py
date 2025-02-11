from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dataclasses import asdict, field, dataclass
from datetime import datetime
import bson

@dataclass
class BaseEntity(ABC):
    _id: Optional[bson.ObjectId] = field(default_factory=bson.ObjectId)
    created: Optional[datetime] = field(default_factory=datetime.now)

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        entity_dict = asdict(self) # this works because the class is abstract and the classes that implement this class are of typ 'DataclassInstance'
        if self._id:
            entity_dict['_id'] = self._id if for_db else str(self._id)  # Keep as ObjectId if for_db=True
        if self.created:
            entity_dict['created'] = self.created if for_db else self.created.isoformat()
        return entity_dict

    @staticmethod
    @abstractmethod
    def from_dict(data: Dict[str, Any]) -> 'BaseEntity':
        pass

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(_id={self._id}, created={self.created})"

    @property
    def id(self):
        return self._id
