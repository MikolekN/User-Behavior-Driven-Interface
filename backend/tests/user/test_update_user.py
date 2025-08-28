from http import HTTPStatus
from unittest.mock import patch

from utils import assert_json_response


def test_update_user_not_logged_in(client):
    response = client.patch('/api/user/update')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


def test_update_user_no_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, "emptyRequestPayload")


def test_update_user_invalid_field(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={'invalid_field': 'some_value'})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, "missingFields;invalid_field")


def test_update_user_missing_password_field(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.patch('/api/user/update', json={'current_password': 'some_value'})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, "userPasswordRequiredFields")


def test_update_user_updated_user_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.update', return_value=None):
        response = client.patch('/api/user/update', json={'login': 'new_login'})
        assert_json_response(response, HTTPStatus.NOT_FOUND, "userUpdateNotFound")


def test_update_user_field_exception(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.update', side_effect=Exception("Database error")):
        response = client.patch('/api/user/update', json={'login': 'new_login'})
        assert_json_response(response, HTTPStatus.INTERNAL_SERVER_ERROR, "errorUpdateUser;Database error")


def test_update_user_field_success(client, test_user, test_user_dto):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.update', return_value=test_user):
        response = client.patch('/api/user/update', json={'login': 'updated_login'})
        json_data = assert_json_response(response, HTTPStatus.OK, "userUpdateSuccessful")
        assert 'user' in json_data
