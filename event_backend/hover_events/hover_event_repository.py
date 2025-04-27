from typing import Type

from shared import BaseRepository

from hover_events.hover_event import HoverEvent


class HoverEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[HoverEvent]:
        return HoverEvent
