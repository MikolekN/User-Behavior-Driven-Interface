from preferences.utils import add_url_to_urls_dict, get_most_common_url_from_urls_dict, kebab_case_to_camel_case, map_element_ids_to_frontend
from page_transition_event.constants import AUTO_REDIRECT_TIME_SPENT_THRESHOLD, DEFAULT_AUTO_REDIRECT_PREFERENCE, DEFAULT_AUTO_REDIRECT_URL, FORM_SUBMIT_CLICK_EVENT_ELEMENT_IDS
import time

class PreferencesService:
    def __init__(self, click_event_repository, page_transition_event_repository):
        self.click_event_repository = click_event_repository
        self.page_transition_event_repository = page_transition_event_repository
  
    def get_user_auto_redirect_preferences(self, user_id: str) -> dict:
        auto_redirect_preference = {}
        
        for element_id in FORM_SUBMIT_CLICK_EVENT_ELEMENT_IDS:
            urls = {}
            form_submit_click_events = self.click_event_repository.get_form_submit_click_events(user_id, element_id)
            auto_redirect_preference[element_id] = DEFAULT_AUTO_REDIRECT_URL
            
            if not form_submit_click_events:
                continue
            
            for e in form_submit_click_events:
                page_transition_event_after_form_submit = self.page_transition_event_repository.get_second_page_transition_event_after_form_submit(user_id, e.start_timestamp)
                
                if not page_transition_event_after_form_submit:
                    continue
                
                if page_transition_event_after_form_submit.time_spent < AUTO_REDIRECT_TIME_SPENT_THRESHOLD:
                    urls = add_url_to_urls_dict(urls, page_transition_event_after_form_submit.next_page)
                else:
                    urls = add_url_to_urls_dict(urls, page_transition_event_after_form_submit.page)

            auto_redirect_preference[element_id] = get_most_common_url_from_urls_dict(urls)

        return map_element_ids_to_frontend(auto_redirect_preference)
        