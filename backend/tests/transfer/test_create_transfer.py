from http import HTTPStatus
from unittest.mock import patch

from tests.constants import TEST_ACCOUNT_DIFFERENT_NUMBER
from utils import assert_json_response


def test_create_transfer_unauthorized(client):
    response = client.post('/api/transfer')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_create_transfer_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

def test_create_transfer_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={"hallo": "hallo"})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'senderAccountNumberRequired')

        response = client.post('/api/transfer', json={"senderAccountNumber": ""})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'recipientAccountNumberRequired')

        response = client.post('/api/transfer', json={
            "senderAccountNumber": "",
            "recipientAccountNumber": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'transferTitleRequired')

        response = client.post('/api/transfer', json={
            "senderAccountNumber": "",
            "recipientAccountNumber": "",
            "transferTitle": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'amountRequired')

def test_create_transfer_invalid_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": "",
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': "hallo"
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidAmount')

def test_create_transfer_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": "",
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': -1
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'negativeAmount')

def test_create_transfer_to_self(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": test_account.account_number,
            "recipientAccountNumber": test_account.account_number,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'cannotTransferToSelf')

def test_create_transfer_sender_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": test_account.account_number,
            "recipientAccountNumber": TEST_ACCOUNT_DIFFERENT_NUMBER,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'senderAccountNotExist')

def test_create_transfer_unauthorised(client, test_user, test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_unauthorised_account):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": test_unauthorised_account.account_number,
            "recipientAccountNumber": TEST_ACCOUNT_DIFFERENT_NUMBER,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, 'unauthorisedAccountAccess')

def test_create_transfer_not_enough_money(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": test_account.account_number,
            "recipientAccountNumber": TEST_ACCOUNT_DIFFERENT_NUMBER,
            "transferTitle": "",
            'amount': 1000000
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'accountDontHaveEnoughMoney')

def test_create_transfer_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.insert', return_value=None), \
            patch('accounts.account_repository.AccountRepository.update', return_value=None):
        response = client.post('/api/transfer', json={
            "senderAccountNumber": test_account.account_number,
            "recipientAccountNumber": TEST_ACCOUNT_DIFFERENT_NUMBER,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.OK, 'transferCreatedSuccessful')
