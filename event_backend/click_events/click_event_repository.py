from typing import Type

from shared import BaseRepository

from click_events.click_event import ClickEvent


class ClickEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[ClickEvent]:
        return ClickEvent
