import requests

from processes.helpers.get_process_definition import get_process_definition


def get_process_definition_xml(process_definition_key: str, access_token: str, cluster_id: str) -> str:
    process_def = get_process_definition(process_definition_key, access_token, cluster_id)
    if not process_def:
        print(f"Process definition {process_definition_key} not found.")
        return ""
    process_definition_key = process_def["key"]
    print(f"Process definition {process_definition_key} found.")
    url = f"https://bru-2.operate.camunda.io/{cluster_id}/v1/process-definitions/{process_definition_key}/xml"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error for XML of process definition {process_definition_key}: {http_err}")
        print(f"Response Text: {response.text}")
        return ""