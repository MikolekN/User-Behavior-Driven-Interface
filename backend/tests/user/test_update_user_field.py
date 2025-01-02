from unittest.mock import patch


def test_update_user_field_not_logged_in(client):
    response = client.patch('/api/user/update')
    assert response.status_code == 401
    
def test_update_user_field_no_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={})
        
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "emptyRequestPayload"

def test_update_user_field_invalid_field(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={'invalid_field': 'some_value'})
        
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "missingFields;invalid_field"

@patch('users.user_repository.UserRepository.find_by_id', return_value=None)
def test_update_user_field_user_not_found_after_update(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={'login': 'new_login'})
        
        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userUpdateNotFound"

@patch('users.user_repository.UserRepository.update', side_effect=Exception("Database error"))
def test_update_user_field_exception(mock_update, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={'login': 'new_login'})
        
        assert response.status_code == 500
        json_data = response.get_json()
        assert 'message' in json_data
        assert "errorUpdateUser;Database error" in json_data['message']

@patch('users.user_repository.UserRepository.find_by_id')
def test_update_user_field_success(mock_find_by_id, client, test_user, test_user_dto):
    with patch('flask_login.utils._get_user', return_value=test_user):
        updated_user_data = test_user_dto
        updated_user_data.login = "updated_login"
        mock_find_by_id.return_value = updated_user_data
        
        response = client.patch('/api/user/update', json={'login': 'updated_login'})
        
        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userUpdateSuccessful"
        assert 'user' in json_data
        assert json_data['user'] == updated_user_data.to_dict()