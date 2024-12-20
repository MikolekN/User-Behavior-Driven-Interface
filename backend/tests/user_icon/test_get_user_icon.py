from unittest.mock import MagicMock, patch


def test_upload_user_icon_not_logged_in(client):
    response = client.get('/api/user/icon')
    assert response.status_code == 401

@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon=None))
def test_get_user_icon_no_icon_set(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get('/api/user/icon')
        
        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "iconNotSetForUser"

# TODO: FIX
@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon="/path/to/nonexistent/icon.png"))
@patch('os.path.exists', return_value=False)
def test_get_user_icon_file_not_found(mock_exists, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get('/api/user/icon')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "iconUserNotFound"

# TODO: FIX
@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon="/path/to/existing/icon.png"))
@patch('os.path.exists', return_value=True)
@patch('flask.helpers.send_file', side_effect=Exception("File access error"))
def test_get_user_icon_file_access_error(mock_send_file, mock_exists, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get('/api/user/icon')

        assert response.status_code == 500
        json_data = response.get_json()
        assert 'message' in json_data
        assert 'Failed to send the icon:' in json_data['message']

# TODO: FIX
@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon="tests/user_icon/test_icon.png"))
@patch('os.path.exists', return_value=True)
@patch('flask.helpers.send_file', return_value=MagicMock(status_code=200))
def test_get_user_icon_success(mock_send_file, mock_exists, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get('/api/user/icon')
        assert response.status_code == 200
