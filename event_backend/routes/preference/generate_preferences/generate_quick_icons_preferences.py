import json
from typing import Optional

import requests

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from config import CAMUNDA_URL

click_events_repository = ClickEventRepository()


def generate_quick_icons_preferences(user_id: str, token_value:str):
    click_events: Optional[list[ClickEvent]] = click_events_repository.get_user_quick_icons_events(user_id)
    if click_events:
        requests.post(
            CAMUNDA_URL,
            data=json.dumps({
                "user_id": user_id,
                "token": token_value,
                "events": [click_event.to_dict() for click_event in click_events]
            })
        )