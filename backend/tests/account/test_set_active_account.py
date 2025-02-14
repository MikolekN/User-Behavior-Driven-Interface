from http import HTTPStatus
from unittest.mock import patch

from tests.constants import TEST_ACCOUNT_NUMBER
from utils import assert_json_response


def test_set_active_account_not_logged_in(client):
    response = client.put(f'/api/accounts/set_active/{TEST_ACCOUNT_NUMBER}')
    assert response.status_code == 401

def test_set_active_account_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.put(f'/api/accounts/set_active/{TEST_ACCOUNT_NUMBER}')
        assert_json_response(response, HTTPStatus.NOT_FOUND, "accountNotExist")

def test_set_active_account_not_authorised(client, test_user, test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_unauthorised_account):
        response = client.put(f'/api/accounts/set_active/{TEST_ACCOUNT_NUMBER}')
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, "unauthorisedAccountAccess")

def test_set_active_account_user_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=None):
        response = client.put(f'/api/accounts/set_active/{TEST_ACCOUNT_NUMBER}')
        assert_json_response(response, HTTPStatus.NOT_FOUND, "userNotExist")

def test_set_active_account_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('users.user_repository.UserRepository.update', return_value=test_user):
        response = client.put(f'/api/accounts/set_active/{TEST_ACCOUNT_NUMBER}')
        assert_json_response(response, HTTPStatus.OK, "activeAccountSetSuccessful")