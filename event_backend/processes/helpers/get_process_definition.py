import requests


def get_process_definition(bpmn_process_id: str, access_token: str, cluster_id: str) -> dict:
    url = f"https://bru-2.operate.camunda.io/{cluster_id}/v1/process-definitions/search"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    payload = {"filter": {"bpmnProcessId": bpmn_process_id}}
    payload["sort"] = [{"field": "version", "order": "DESC"}]
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("items", [])[0] if data.get("items") else {}
    except requests.exceptions.HTTPError:
        return {}