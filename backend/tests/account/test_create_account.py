from unittest.mock import patch

from tests.constants import TEST_ACCOUNT_NAME, TEST_ACCOUNT_TYPE, TEST_ACCOUNT_CURRENCY
from utils import assert_json_response


def test_create_account_not_logged_in(client):
    response = client.post(f'/api/accounts/')
    assert response.status_code == 401

def test_create_account_empty_account_name(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post(f'/api/accounts/', json={
            "account_type": TEST_ACCOUNT_TYPE,
            "currency": TEST_ACCOUNT_CURRENCY
        })
        assert_json_response(response, 400, "accountNameRequired")

def test_create_account_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.insert', return_value=test_account):
        response = client.post(f'/api/accounts/', json={
            "account_name": TEST_ACCOUNT_NAME,
            "account_type": TEST_ACCOUNT_TYPE,
            "currency": TEST_ACCOUNT_CURRENCY
        })
        assert_json_response(response, 201, "accountCreatedSuccessfully")