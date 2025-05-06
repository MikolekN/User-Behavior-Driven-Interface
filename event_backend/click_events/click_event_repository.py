from typing import Type, Optional

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

    def get_user_quick_icons_events(self, user_id: str) -> Optional[list[ClickEvent]]:
        pipeline = [
            {"$match":
                {
                    "user_id": bson.ObjectId(user_id),
                    "event_type": "click_event",
                    "element_id": {"$in": [
                        "quick-icons-language-selector",
                        "quick-icons-theme-toggle",
                        "quick-icons-login",
                        "quick-icons-logout",
                        "quick-icons-register",
                        "quick-icons-settings",
                        "quick-icons-profile",
                        "dropdown-language-selector",
                        "dropdown-theme-toggle",
                        "dropdown-login",
                        "dropdown-logout",
                        "dropdown-register",
                        "dropdown-settings",
                        "dropdown-profile"
                    ]}
                }
            }
        ]
        click_events = super().aggregate(pipeline)
        if click_events:
            return [ClickEvent.from_dict(click_event) for click_event in click_events]
        return None

    def get_user_quick_icons_preference(self, user_id: str) -> str:
        pipeline = [
            {"$match":
                {
                    "user_id": bson.ObjectId(user_id),
                    "event_type": "click_event",
                    "element_id": {"$in": [
                        "quick-icons-language-selector",
                        "quick-icons-theme-toggle",
                        "quick-icons-login",
                        "quick-icons-logout",
                        "quick-icons-register",
                        "quick-icons-settings",
                        "quick-icons-profile",
                        "dropdown-language-selector",
                        "dropdown-theme-toggle",
                        "dropdown-login",
                        "dropdown-logout",
                        "dropdown-register",
                        "dropdown-settings",
                        "dropdown-profile"
                    ]}
                }
            },
            {"$group":
                 {
                     "_id": "$element_id",
                     "count": {"$sum": 1}
                 }
            },
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
    
    def get_form_submit_click_events(self, user_id: str, element_id: str) -> Optional[list[ClickEvent]]:
        pipeline = [
                {"$match": {"user_id": bson.ObjectId(user_id), "event_type": "click_event", "element_id": element_id}},
                {"$sort": {"start_timestamp": 1}}
            ]
        form_submit_click_events = super().aggregate(pipeline)

        if form_submit_click_events:
            return [ClickEvent.from_dict(event) for event in form_submit_click_events]
        else: 
            return None
