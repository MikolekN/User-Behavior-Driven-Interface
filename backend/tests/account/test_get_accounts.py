from unittest.mock import patch

from utils import assert_json_response


def test_get_accounts_not_logged_in(client):
    response = client.get('/api/accounts/')
    assert response.status_code == 401

def test_get_accounts_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_accounts', return_value=None):
        response = client.get('/api/accounts/')
        assert_json_response(response, 404, "accountsNotExist")

def test_get_accounts_successful(client, test_user, test_accounts):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_accounts', return_value=test_accounts):
        response = client.get('/api/accounts/')
        assert_json_response(response, 200, "accountsFetchSuccessful")