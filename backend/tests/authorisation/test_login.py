from unittest.mock import patch

from tests.constants import TEST_USER_EMAIL, TEST_USER_PASSWORD
from utils import assert_json_response


def test_login_already_logged_in(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        assert_json_response(response, 409, "alreadyLogged")

def test_login_empty_data(client):
    response = client.post('/api/login', json={})
    assert_json_response(response, 400, "emptyRequestPayload")

def test_login_missing_fields(client):
    response = client.post('/api/login', json={
        'email': TEST_USER_EMAIL
    })
    assert_json_response(response, 400, "authFieldsRequired")

def test_login_invalid_field_types(client):
    response = client.post('/api/login', json={
        'email': 0,
        'password': TEST_USER_PASSWORD
    })
    assert_json_response(response, 400, "invalidAuthFieldsType")

def test_login_empty_fields(client):
    response = client.post('/api/login', json={
        'email': "",
        'password': TEST_USER_PASSWORD
    })
    assert_json_response(response, 400, "emptyAuthFields")

def test_login_user_not_exist(client):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=None):
        response = client.post('/api/login', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        assert_json_response(response, 404, "userNotExist")

def test_login_wrong_password(client, test_user):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_USER_EMAIL,
            'password': "WrongPassword123"  # Incorrect password
        })
        assert_json_response(response, 401, "invalidCredentials")

def test_login_success(client, test_user):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        json_data = assert_json_response(response, 200, "loginSuccessful")
        assert 'user' in json_data
