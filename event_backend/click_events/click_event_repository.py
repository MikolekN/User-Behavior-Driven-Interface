from typing import Type

import bson
from shared import BaseRepository

from click_events.click_event import ClickEvent
from page_transition_event.constants import BASE_QUICK_ICONS_PREFERENCE


class ClickEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[ClickEvent]:
        return ClickEvent
    
    def get_user_quick_icons_preference(self, user_id: str) -> str:
        pipeline = [
            {"$match": {"user_id": bson.ObjectId(user_id), "event_type": "click_event"}},
            {"$group": {"_id": "$element_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ]
        most_frequent_element = super().aggregate(pipeline)
        if not most_frequent_element:
            return BASE_QUICK_ICONS_PREFERENCE

        element_id = most_frequent_element[0]["_id"]
        if element_id.split('-')[0] == 'dropdown':
            element_id = 'quick-icons-' + '-'.join(element_id.split('-')[1:])
        return element_id
