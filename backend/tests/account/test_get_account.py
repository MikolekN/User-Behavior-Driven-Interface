from http import HTTPStatus
from unittest.mock import patch

import pytest

from conftest import invalid_account_number, wrong_length_account_number, non_digit_account_number
from tests.constants import TEST_ACCOUNT_NUMBER
from utils import assert_json_response


def test_get_account_not_logged_in(client):
    response = client.get(f'/api/accounts/{TEST_ACCOUNT_NUMBER}')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

@pytest.mark.parametrize(
    "payload, expected_status, expected_message",
    [
        (invalid_account_number(), HTTPStatus.BAD_REQUEST, "invalidAccountNumber"),
        (wrong_length_account_number(), HTTPStatus.BAD_REQUEST, "invalidAccountNumber"),
        (non_digit_account_number(), HTTPStatus.BAD_REQUEST, "invalidAccountNumber")
    ],
    ids=[
        "Invalid account number",
        "Wrong length account number",
        "Non digit account number"
    ]
)
def test_get_account_validation_cases(client, payload, expected_status, expected_message, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get(f'/api/accounts/{payload}')
        assert_json_response(response, expected_status, expected_message)

def test_get_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.get(f'/api/accounts/{TEST_ACCOUNT_NUMBER}')
        assert_json_response(response, HTTPStatus.NOT_FOUND, "accountNotExist")

def test_get_account_successful(client, test_user, test_account, test_account_dto):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('accounts.account_dto.AccountDto.from_account', return_value=test_account_dto):
        response = client.get(f'/api/accounts/{TEST_ACCOUNT_NUMBER}')
        json_data = assert_json_response(response, HTTPStatus.OK, "accountFetchSuccessful")
        assert 'account' in json_data