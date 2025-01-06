from unittest.mock import patch

def test_logout_not_logged_in(client):
    response = client.post('/api/logout')
    assert response.status_code == 401

def test_logout_success(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/logout')
        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "logoutSuccessful"
