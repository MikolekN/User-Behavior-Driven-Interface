from typing import Type, Optional

import bson
from shared import BaseRepository

from hover_events.hover_event import HoverEvent


class HoverEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[HoverEvent]:
        return HoverEvent

    def get_next_step_events(self, user_id: str) -> Optional[list[HoverEvent]]:
        pipeline = [
            {
                "$match": {
                    "user_id": bson.ObjectId(user_id),
                    "event_type": "hover_event"
                }
            }
        ]
        hover_events = super().aggregate(pipeline)
        if hover_events:
            return [HoverEvent.from_dict(hover_event) for hover_event in hover_events]
        return None