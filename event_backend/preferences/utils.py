from page_transition_event.constants import DEFAULT_AUTO_REDIRECT_URL


def kebab_case_to_camel_case(s: str) -> str:
    parts = s.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def get_most_common_url_from_urls_dict(urls: dict) -> str:
    if not urls:
        return DEFAULT_AUTO_REDIRECT_URL
    
    max_url = ""
    max_value = max(urls.values())

    for url in (list(urls.keys())):
        if urls[url] == max_value:
            max_url = url

    return max_url

def add_url_to_urls_dict(urls: dict, page_url: str) -> dict:
    if page_url not in urls:
        urls[page_url] = 1
    else:
        urls[page_url] += 1

    return urls

def map_element_ids_to_frontend(d: dict) -> dict:
    new_d = {}

    for k in d.keys():
        new_d[kebab_case_to_camel_case(k)] = d[k]

    return new_d