import requests


def get_active_process_instances(bpmn_process_id: str, access_token: str, cluster_id: str) -> list:
    url = f"https://bru-2.operate.camunda.io/{cluster_id}/v1/process-instances/search"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    payload = {
        "filter": {
            "bpmnProcessId": bpmn_process_id,
            "state": "ACTIVE"
        },
        "sort": [{
            "field": "startDate",
            "order": "DESC"
        }]
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json().get("items", [])
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error for active process instances {bpmn_process_id}: {http_err}")
        print(f"Response Text: {response.text}")
        return []