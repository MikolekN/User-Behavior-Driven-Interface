from http import HTTPStatus
from unittest.mock import patch

from utils import assert_json_response


def test_get_user_not_logged_in(client):
    response = client.get('/api/user')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_get_user_not_found(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=None):
        response = client.get('/api/user')
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'userNotExist')

def test_get_user_success(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user):
        response = client.get('/api/user')
        assert_json_response(response, HTTPStatus.OK, 'userFetchSuccessful')
