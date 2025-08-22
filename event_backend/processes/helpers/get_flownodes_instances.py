from typing import Optional

import requests


def get_flownodes_instances(process_instance_key: str, access_token: str, cluster_id: str) -> Optional[list]:
    url = f"https://bru-2.operate.camunda.io/{cluster_id}/v1/flownode-instances/search"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    payload = {
        "filter": {
            "processInstanceKey": str(process_instance_key),
            "state": "ACTIVE",
            "type": "EVENT_BASED_GATEWAY"
        }
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("items", None)
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error for flow nodes of process instance {process_instance_key}: {http_err}")
        print(f"Response Text: {response.text}")
        return None
