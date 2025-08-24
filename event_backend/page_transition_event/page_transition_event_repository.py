from datetime import datetime
from typing import Optional, Type

import bson
from shared import BaseRepository

from constants import MIN_TIME_SPENT
from page_transition_event.constants import MAX_PAGE_TRANSITION_PREFERENCES_LINKS, \
    PAGE_TRANSITION_PREFERENCES_EDIT_MAPPINGS
from page_transition_event.page_mapper import map_page
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
            {"$limit": MAX_PAGE_TRANSITION_PREFERENCES_LINKS + 1}
        ]
        most_frequent_pages = super().aggregate(pipeline)

        if not most_frequent_pages:
            return []

        mapped_pages = map_page(most_frequent_pages, PAGE_TRANSITION_PREFERENCES_EDIT_MAPPINGS)
        sorted_pages = [page for page, _ in sorted(mapped_pages.items(), key=lambda x: x[1], reverse=True)]

        if "/" in sorted_pages:
            sorted_pages.remove("/")
        elif len(sorted_pages) > MAX_PAGE_TRANSITION_PREFERENCES_LINKS:
            sorted_pages.pop()

        return sorted_pages

    def get_next_step_events(self, user_id: str) -> Optional[list[PageTransitionEvent]]:
        pipeline = [
            {
                "$match": {
                    "user_id": bson.ObjectId(user_id),
                    "event_type": "page_transition_event",
                    "time_spent": {"$gt": MIN_TIME_SPENT}
                }
            }
        ]
        page_transition_events = super().aggregate(pipeline)
        if page_transition_events:
            return [PageTransitionEvent.from_dict(page_transition_event) for page_transition_event in
                    page_transition_events]
        return None

    def get_second_page_transition_event_after_form_submit(self, user_id: str, form_submit_timestamp: datetime) -> \
            Optional[list[PageTransitionEvent]]:
        pipeline = [
            {"$match": {"user_id": bson.ObjectId(user_id), "event_type": "page_transition_event",
                        "start_timestamp": {"$gt": form_submit_timestamp}}},
            {"$sort": {"start_timestamp": 1}},
            {"$limit": 2},
            {"$skip": 1}
        ]
        page_transition_events_after_form_submit = super().aggregate(pipeline)

        if page_transition_events_after_form_submit:
            return PageTransitionEvent.from_dict(page_transition_events_after_form_submit[0])
        else:
            return None

    def get_top_visited_page_within_submenu_for_menu_priority(self, user_id: str, submenu_pages: dict) -> str:
        pipeline = [
            {
                "$match": {
                    "user_id": bson.ObjectId(user_id),
                    "event_type": "page_transition_event",
                    "next_page": {"$in": submenu_pages}
                }
            },
            {"$group":
                {
                    "_id": "$next_page",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ]

        top_visited_page = super().aggregate(pipeline)

        if top_visited_page:
            return top_visited_page[0]['_id']
        else:
            return None
