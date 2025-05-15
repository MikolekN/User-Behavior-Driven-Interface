from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any, Optional

import bson
from shared import BaseEntity


@dataclass
class BaseEvent(BaseEntity, ABC):
    session_id: Optional[int] = None
    case_id: Optional[int] = None
    event_id: Optional[bson.ObjectId] = None
    user_id: Optional[bson.ObjectId] = None
    start_timestamp: Optional[datetime] = None
    event_type: Optional[str] = None
    page: Optional[str] = None
    activity: Optional[str] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        entity_dict = super().to_dict(for_db)
        if self.event_id:
            entity_dict['event_id'] = self.event_id if for_db else str(self.event_id)
        if self.user_id:
            entity_dict['user_id'] = self.user_id if for_db else str(self.user_id)
        if self.start_timestamp:
            entity_dict['start_timestamp'] = self.start_timestamp if for_db else self.start_timestamp.isoformat()
        return entity_dict

    @staticmethod
    @abstractmethod
    def from_dict(data: Dict[str, Any]) -> 'BaseEvent':
        pass

    @property
    def id(self) -> bson.ObjectId:
        return self._id
