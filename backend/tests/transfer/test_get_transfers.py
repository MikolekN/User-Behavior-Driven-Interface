from http import HTTPStatus
from unittest.mock import patch

from conftest import test_unauthorised_account
from utils import assert_json_response


def test_get_transfers_unauthorized(client):
    response = client.get('/api/transfers')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_get_transfers_user_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=None):
        response = client.get('/api/transfers')
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'userNotExist')

def test_get_transfers_account_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=None):
        response = client.get('/api/transfers')
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'accountNotExist')

def test_get_transfers_transfers_empty(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.find_transfers', return_value=None):
        response = client.get('/api/transfers')
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'transferListEmpty')

def test_get_transfers_transfers_unauthorised(client, test_user, test_unauthorised_account, test_transfers):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=test_unauthorised_account), \
            patch('transfers.transfer_repository.TransferRepository.find_transfers', return_value=test_transfers):
        response = client.get('/api/transfers')
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, 'unauthorisedAccountAccess')

def test_get_transfers_successful(client, test_user, test_account, test_transfers):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('users.user_repository.UserRepository.find_by_id', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_id', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.find_transfers', return_value=test_transfers):
        response = client.get('/api/transfers')
        assert_json_response(response, HTTPStatus.OK, 'transferListGetSuccessful')
