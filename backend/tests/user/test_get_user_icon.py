from unittest.mock import MagicMock, patch

from utils import assert_json_response


def test_upload_user_icon_not_logged_in(client):
    response = client.get('/api/user/icon')
    assert response.status_code == 401

def test_get_user_icon_no_icon_set(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=None):
        response = client.get('/api/user/icon')
        assert_json_response(response, 404, 'iconNotSetForUser')

def test_get_user_icon_not_set(client, test_user_without_icon):
    with patch('flask_login.utils._get_user', return_value=test_user_without_icon), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user_without_icon):
        response = client.get('/api/user/icon')
        assert_json_response(response, 404, 'iconNotSetForUser')

def test_get_user_icon_file_not_found(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('os.path.exists', return_value=False):
        response = client.get('/api/user/icon')
        assert_json_response(response, 404, 'iconNotFound')

def test_get_user_icon_file_error(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('os.path.exists', return_value=True), \
            patch('flask.helpers.send_file', side_effect=Exception("File access error")):
        response = client.get('/api/user/icon')

        assert response.status_code == 500
        json_data = response.get_json()
        assert 'message' in json_data
        assert 'sendIconFailed;' in json_data['message']

# TODO: fix this test
# @patch('users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon="tests/user_icon/test_icon.png"))
# @patch('os.path.exists', return_value=True)
# @patch('flask.helpers.send_file', return_value=MagicMock(status_code=200))
# def test_get_user_icon_success(mock_send_file, mock_exists, mock_find_by_id, client, test_user):
#     with patch('flask_login.utils._get_user', return_value=test_user):
#         response = client.get('/api/user/icon')
#         assert response.status_code == 200
