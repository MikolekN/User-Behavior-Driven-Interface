from typing import Type

import bson
from shared import BaseRepository

from page_transition_event.page_transition_event import PageTransitionEvent


class PageTransitionEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[PageTransitionEvent]:
        return PageTransitionEvent

    def get_user_page_transition_preference(self, user_id: str) -> list:
        pipeline = [
            {"$match": {"user_id": bson.ObjectId(user_id), "event_type": "page_transition_event"}},
            {"$group": {"_id": "$next_page", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 4}
        ]
        most_frequent_pages = super().aggregate(pipeline)

        if (not most_frequent_pages):
            return []
        
        pages = []
        for elem in most_frequent_pages:
            pages.append(elem["_id"])

        return pages
