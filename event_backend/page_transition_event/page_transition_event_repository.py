from typing import Type

from shared import BaseRepository

from page_transition_event.page_transition_event import PageTransitionEvent


class PageTransitionEventRepository(BaseRepository):
    COLLECTION: str = 'Events'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[PageTransitionEvent]:
        return PageTransitionEvent
