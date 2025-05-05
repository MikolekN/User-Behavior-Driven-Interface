from dataclasses import dataclass
from typing import Optional, Dict, Any

import bson

from base_event import BaseEvent


@dataclass
class PageTransitionEvent(BaseEvent):
    next_page: Optional[str] = None
    time_spent: Optional[int] = 0

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        page_transition_event_dict = super().to_dict(for_db)
        return page_transition_event_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'PageTransitionEvent':
        return PageTransitionEvent(
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
            next_page=data.get('next_page', None),
            time_spent=data.get('time_spent', None)
        )
