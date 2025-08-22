import requests


def get_access_token(client_id: str, client_secret: str, audience: str) -> str:
    url = "https://login.cloud.camunda.io/oauth/token"
    payload = {
        "grant_type": "client_credentials",
        "audience": audience,
        "client_id": client_id,
        "client_secret": client_secret
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(url, data=payload, headers=headers)
    response.raise_for_status()
    return response.json()["access_token"]