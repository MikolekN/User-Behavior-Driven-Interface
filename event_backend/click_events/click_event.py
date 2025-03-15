from dataclasses import dataclass
from typing import Optional, Dict, Any

import bson

from base_event import BaseEvent


@dataclass
class ClickEvent(BaseEvent):
    element_id: Optional[str] = None
    from_dropdown: Optional[bool] = None

    def to_dict(self, for_db: bool = False) -> Dict[str, Any]:
        click_event_dict = super().to_dict(for_db)
        return click_event_dict

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'ClickEvent':
        return ClickEvent(
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
            from_dropdown=data.get('from_dropdown', None)
        )
