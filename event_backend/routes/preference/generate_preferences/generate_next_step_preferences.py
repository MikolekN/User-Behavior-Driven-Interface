from typing import Union, List

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from hover_events.hover_event import HoverEvent
from hover_events.hover_event_repository import HoverEventRepository
from page_transition_event.page_transition_event import PageTransitionEvent
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository

click_events_repository = ClickEventRepository()
hover_events_repository = HoverEventRepository()
page_transitions_events_repository = PageTransitionEventRepository()

Event = Union[ClickEvent, HoverEvent, PageTransitionEvent]

def generate_next_step_preferences(user_id: str):
    click_events: List[ClickEvent] = click_events_repository.get_next_step_events(user_id) or []
    hover_events: List[HoverEvent] = hover_events_repository.get_next_step_events(user_id) or []
    page_transition_events: List[PageTransitionEvent] = page_transitions_events_repository.get_next_step_events(user_id) or []

    all_events: List[Event] = click_events + hover_events + page_transition_events

    all_events.sort(key=lambda event: event.start_timestamp)

