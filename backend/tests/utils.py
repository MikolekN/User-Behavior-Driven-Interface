def assert_json_response(response, expected_status_code, expected_message):
    assert response.status_code == expected_status_code
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == expected_message
    return json_data