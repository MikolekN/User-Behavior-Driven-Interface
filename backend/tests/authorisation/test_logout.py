from unittest.mock import patch

def test_logout_success(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/logout')
        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Logged out successfully"
        # Not able to check because still in the _get_user=test_user context
        # assert not current_user.is_authenticated
        
def test_logout_not_logged_in(client):
    response = client.post('/api/logout')
    assert response.status_code == 401
