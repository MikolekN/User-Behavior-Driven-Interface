from unittest.mock import patch

from utils import assert_json_response


def test_get_active_account_not_logged_in(client):
    response = client.get('/api/accounts/active')
    assert response.status_code == 401

def test_get_active_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=None):
        response = client.get('/api/accounts/active')
        assert_json_response(response, 404, "accountNotExist")

def test_get_active_account_successful(client, test_user, test_account, test_account_dto):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=test_account), \
            patch('accounts.account_dto.AccountDto.from_account', return_value=test_account_dto):
        response = client.get('/api/accounts/active')
        json_data = assert_json_response(response, 200, "accountFetchSuccessful")
        assert 'account' in json_data