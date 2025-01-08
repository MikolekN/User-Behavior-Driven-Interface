from http import HTTPStatus
from unittest.mock import patch

from utils import assert_json_response


def test_create_loan_unauthorized(client):
    response = client.post('/api/transfer/loan')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_create_loan_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

def test_create_loan_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={"hallo": "hallo"})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'recipientAccountNumberRequired')

        response = client.post('/api/transfer/loan', json={ "recipientAccountNumber": "" })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'transferTitleRequired')

        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'amountRequired')

def test_create_loan_invalid_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': "hallo"
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidAmount')

def test_create_loan_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': -1
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'negativeAmount')

def test_create_loan_small_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': 1
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'amountTooSmall;1000')

def test_create_loan_big_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': 1000000
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'amountTooBig;100000')

def test_create_loan_invalid_amount_format(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": "",
            "transferTitle": "",
            'amount': 9999
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidAmountFormat')

def test_create_loan_sender_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": test_account.account_number,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'recipientAccountNotExist')

def test_create_loan_unauthorised(client, test_user, test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_unauthorised_account):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": test_unauthorised_account.account_number,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, 'unauthorisedAccountAccess')

def test_create_loan_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.insert', return_value=None), \
            patch('accounts.account_repository.AccountRepository.update', return_value=None):
        response = client.post('/api/transfer/loan', json={
            "recipientAccountNumber": test_account.account_number,
            "transferTitle": "",
            'amount': 1000
        })
        assert_json_response(response, HTTPStatus.OK, 'loanCreatedSuccessful')
