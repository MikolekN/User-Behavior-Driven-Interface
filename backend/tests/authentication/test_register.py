from unittest.mock import patch

import pytest

from conftest import empty_user_data, missing_email_user_data, missing_password_user_data, invalid_email_user_data, \
    invalid_password_user_data, empty_email_user_data, empty_password_user_data
from utils import assert_json_response


def test_register_when_user_already_logged_in(client, test_user, valid_user_data):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/register', json=valid_user_data)
        assert_json_response(response, 409, "alreadyLogged")


@pytest.mark.parametrize(
    "payload, expected_status, expected_message",
    [
        (empty_user_data(), 400, "emptyRequestPayload"),
        (missing_email_user_data(), 400, "authFieldsRequired"),
        (missing_password_user_data(), 400, "authFieldsRequired"),
        (invalid_email_user_data(), 400, "invalidAuthFieldsType"),
        (invalid_password_user_data(), 400, "invalidAuthFieldsType"),
        (empty_email_user_data(), 400, "emptyAuthFields"),
        (empty_password_user_data(), 400, "emptyAuthFields"),
    ],
    ids=[
        "Empty data",
        "Missing email",
        "Missing password",
        "Invalid email type",
        "Invalid password type",
        "Empty email field",
        "Empty password field",
    ]
)
def test_register_validation_cases(client, payload, expected_status, expected_message):
    response = client.post('/api/register', json=payload)
    assert_json_response(response, expected_status, expected_message)


def test_register_when_user_already_exists(client, test_user, valid_user_data):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/register', json=valid_user_data)
        assert_json_response(response, 409, "userExist")


def test_register_success(client, test_user, valid_user_data):
    with patch('users.user_repository.UserRepository.find_by_email', return_value=None), \
            patch('users.user_repository.UserRepository.insert', return_value=test_user):
        response = client.post('/api/register', json=valid_user_data)
        json_data = assert_json_response(response, 201, "registerSuccessful")
        assert 'user' in json_data
