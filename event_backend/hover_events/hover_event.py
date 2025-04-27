from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

import bson

from base_event import BaseEvent


@dataclass
class HoverEvent(BaseEvent):
    element_id: Optional[str] = None
    end_timestamp: Optional[datetime] = None
    duration: Optional[int] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        hover_event_dict = super().to_dict(for_db)
        return hover_event_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'HoverEvent':
        return HoverEvent(
            _id=bson.ObjectId(data['_id']) if '_id' in data else None,
            created=data.get('created', None),
            is_deleted=data.get('is_deleted', False),
            session_id=data.get('session_id', None),
            case_id=data.get('case_id', None),
            event_id=data.get('event_id', None),
            user_id=data.get('user_id', None),
            start_timestamp=data.get('start_timestamp', None),
            event_type=data.get('event_type', None),
            page=data.get('page', None),
            element_id=data.get('element_id', None),
            end_timestamp=data.get('end_timestamp', None),
            duration=data.get('duration', None)
        )
