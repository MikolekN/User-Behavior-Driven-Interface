from unittest.mock import patch


def test_get_user_not_logged_in(client):
    response = client.get('/api/user')
    assert response.status_code == 401

@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=None)
def test_get_user_not_found(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get('/api/user')
        
        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userNotExist"

# TODO: FIX
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_get_user_success(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):   
        mock_find_by_id.return_value = test_user
        
        response = client.get('/api/user')
        
        assert response.status_code == 200
        json_data = response.get_json()
        assert 'user' in json_data
        assert json_data['user'] == test_user.sanitize_user_dict()