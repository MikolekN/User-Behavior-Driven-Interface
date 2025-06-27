from page_transition_event.page_transition_event_repository import PageTransitionEventRepository

page_transition_event_repository = PageTransitionEventRepository()

def generate_menu_priority_preferences(user_id: str, menu_structure: dict) -> dict:
    menu_priority_preference = {}
    pages = []

    for submenu in menu_structure['menu']:
        page = page_transition_event_repository.get_top_visited_page_within_submenu_for_menu_priority(user_id, list(menu_structure['menu'][submenu].values()))
        if (page):
            pages.append(page)

    menu_priority_preference['pagesToHighlight'] = pages

    return menu_priority_preference
