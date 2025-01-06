from unittest.mock import patch

from tests.constants import TEST_USER_EMAIL, TEST_USER_PASSWORD
from utils import assert_json_response


def test_register_already_logged_in(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/register', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        assert_json_response(response, 409, "alreadyLogged")

def test_register_empty_data(client):
    response = client.post('/api/register', json={})
    assert_json_response(response, 400, "emptyRequestPayload")

def test_register_missing_fields(client):
    response = client.post('/api/register', json={
        'email': TEST_USER_EMAIL,
    })
    assert_json_response(response, 400, "authFieldsRequired")

def test_register_invalid_field_types(client):
    response = client.post('/api/register', json={
        'email': 0,
        'password': TEST_USER_PASSWORD
    })
    assert_json_response(response, 400, "invalidAuthFieldsType")

def test_register_empty_fields(client):
    response = client.post('/api/register', json={
        'email': "",
        'password': TEST_USER_PASSWORD
    })
    assert_json_response(response, 400, "emptyAuthFields")

def test_register_already_exists(client, test_user):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/register', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        assert_json_response(response, 409, "userExist")

def test_register_success(client, test_user):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=None), \
            patch('users.user_repository.UserRepository.insert', return_value=test_user):
        response = client.post('/api/register', json={
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        json_data = assert_json_response(response, 201, "registerSuccessful")
        assert 'user' in json_data
