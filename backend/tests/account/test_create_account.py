from http import HTTPStatus
from unittest.mock import patch

import pytest

from conftest import empty_account_data, invalid_account_data, missing_fields_user_data, extra_fields_user_data, \
    invalid_fields_user_data, empty_fields_user_data, invalid_currency_format_user_data, invalid_account_type_user_data
from utils import assert_json_response


def test_create_account_not_logged_in(client):
    response = client.post(f'/api/accounts/')
    assert response.status_code == 401


@pytest.mark.parametrize(
    "payload, expected_status, expected_message",
    [
        (empty_account_data(), HTTPStatus.BAD_REQUEST, "emptyRequestPayload"),
        (invalid_account_data(), HTTPStatus.BAD_REQUEST, "invalidRequestPayload"),
        (missing_fields_user_data(), HTTPStatus.BAD_REQUEST, "missingFields;account_name,type,currency"),
        (extra_fields_user_data(), HTTPStatus.BAD_REQUEST, "extraFields;hallo"),
        (invalid_fields_user_data(), HTTPStatus.BAD_REQUEST, "invalidTypeFields;account_name,type,currency"),
        (empty_fields_user_data(), HTTPStatus.BAD_REQUEST, "emptyFields;account_name,type,currency"),
        (invalid_currency_format_user_data(), HTTPStatus.BAD_REQUEST, "currencyInvalidFormat"),
        (invalid_account_type_user_data(), HTTPStatus.BAD_REQUEST, "accountTypeInvalid"),
    ],
    ids=[
        "Empty data",
        "Invalid data",
        "Missing fields",
        "Extra fields",
        "Invalid fields",
        "Empty fields",
        "Invalid currency format",
        "Invalid account type"
    ]
)
def test_create_account_validation_cases(client, payload, expected_status, expected_message, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/accounts/', json=payload)
        assert_json_response(response, expected_status, expected_message)


def test_create_account_user_not_exist(client, test_user, test_account, valid_account_data):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post(f'/api/accounts/', json=valid_account_data)
        assert_json_response(response, HTTPStatus.NOT_FOUND, "userNotFound")


def test_create_account_successful(client, test_user, test_account, valid_account_data):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.insert', return_value=test_account):
        response = client.post(f'/api/accounts/', json=valid_account_data)
        assert_json_response(response, HTTPStatus.CREATED, "accountCreatedSuccessfully")
