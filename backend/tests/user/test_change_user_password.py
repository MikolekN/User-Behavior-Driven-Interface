from unittest.mock import patch, MagicMock
from backend.tests.constants import TEST_PASSWORD

def test_change_user_password_not_logged_in(client):
    response = client.patch('/api/user/password')
    assert response.status_code == 401

def test_change_user_password_missing_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/password', json={})
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Current password and new password are required"

        response = client.patch('/api/user/password', json={'current_password': 'old_password'})
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['message'] == "Current password and new password are required"

        response = client.patch('/api/user/password', json={'new_password': 'new_password'})
        assert response.status_code == 400
        json_data = response.get_json()
        assert json_data['message'] == "Current password and new password are required"

@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_change_user_password_incorrect_current_password(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_user
        
        response = client.patch('/api/user/password', json={'current_password': 'wrong_password', 'new_password': 'new_password'})
        
        assert response.status_code == 401
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Current password is incorrect"

@patch('backend.users.user_repository.UserRepository.update', side_effect=Exception("Database error"))
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_change_user_password_exception(mock_find_by_id, mock_update, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_user

        response = client.patch('/api/user/password', json={'current_password': TEST_PASSWORD, 'new_password': 'new_secure_password'})
        
        assert response.status_code == 500
        json_data = response.get_json()
        assert 'message' in json_data
        assert "Error updating password:" in json_data['message']

@patch('backend.users.user_repository.UserRepository.update')
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_change_user_password_success(mock_find_by_id, mock_update, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_user

        response = client.patch('/api/user/password', json={'current_password': TEST_PASSWORD, 'new_password': 'new_secure_password'})
        
        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Password updated successfully"
        mock_update.assert_called_once()
