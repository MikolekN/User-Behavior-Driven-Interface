from click_events.click_event_repository import ClickEventRepository
from page_transition_event.constants import AUTO_REDIRECT_TIME_SPENT_THRESHOLD, DEFAULT_AUTO_REDIRECT_URL, \
    FORM_SUBMIT_CLICK_EVENT_ELEMENT_IDS
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from preferences.utils import add_url_to_urls_dict, get_most_common_url_from_urls_dict, map_element_ids_to_frontend

click_event_repository = ClickEventRepository()
page_transition_event_repository = PageTransitionEventRepository()


def generate_auto_redirect_preferences(user_id: str) -> dict:
    auto_redirect_preference = {}

    for element_id in FORM_SUBMIT_CLICK_EVENT_ELEMENT_IDS:
        urls = {}
        form_submit_click_events = click_event_repository.get_form_submit_click_events(user_id, element_id)
        auto_redirect_preference[element_id] = DEFAULT_AUTO_REDIRECT_URL

        if not form_submit_click_events:
            continue

        for e in form_submit_click_events:
            page_transition_event_after_form_submit = page_transition_event_repository.get_second_page_transition_event_after_form_submit(
                user_id, e.start_timestamp)

            if not page_transition_event_after_form_submit:
                continue

            if page_transition_event_after_form_submit.time_spent < AUTO_REDIRECT_TIME_SPENT_THRESHOLD:
                urls = add_url_to_urls_dict(urls, page_transition_event_after_form_submit.next_page)
            else:
                urls = add_url_to_urls_dict(urls, page_transition_event_after_form_submit.page)

        auto_redirect_preference[element_id] = get_most_common_url_from_urls_dict(urls)

    return map_element_ids_to_frontend(auto_redirect_preference)
