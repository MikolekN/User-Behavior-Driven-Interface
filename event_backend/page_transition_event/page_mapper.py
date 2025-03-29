def remove_id_from_edit_path(page: str) -> str:
    if 'edit' not in page:
        return page
    
    parts = page.split('/')
    if len(parts) > 2:
        parts = parts[:-1]

    return '/'.join(parts)

def remove_backslash_from_page(page: str) -> str:
    if len(page) > 1:
        return page.rstrip('/')
    else:
        return page

def get_mapped_page(page_without_id: str, page_mappings: dict) -> str:
    mapped_page = ""

    if page_without_id in page_mappings:
        mapped_page = page_mappings[page_without_id]
    else: 
        mapped_page = page_without_id

    return mapped_page

def map_page(most_frequent_pages: dict, page_mappings: dict) -> list[str]:
    """Maps dynamic edit pages and merges counts if needed."""
    mapped_pages = {}

    for elem in most_frequent_pages:
        page = elem["_id"]
        count = elem["count"]
        filtered_page = remove_backslash_from_page(remove_id_from_edit_path(page))
        mapped_page = get_mapped_page(filtered_page, page_mappings)
        
        if mapped_page not in mapped_pages:
            mapped_pages[mapped_page] = count
        else:
            mapped_pages[mapped_page] += count

    return mapped_pages
