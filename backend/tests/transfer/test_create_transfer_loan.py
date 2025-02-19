from http import HTTPStatus
from unittest.mock import patch

from transfer.constants import TEST_MIN_LOAN_AMOUNT, TEST_MAX_LOAN_AMOUNT
from utils import assert_json_response


def test_create_loan_unauthorized(client):
    response = client.post('/api/transfer/loan')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_create_loan_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

def test_create_loan_missing_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;title,amount')

        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "",
            "title": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;amount')

def test_create_loan_extra_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "",
            "title": "",
            "amount": 0,
            "hallo": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'extraFields;hallo')

def test_create_loan_invalid_recipient_account_number_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": 5,
            "title": "",
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;recipient_account_number')

def test_create_loan_invalid_title_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "",
            "title": 5,
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;title')

def test_create_loan_invalid_amount_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "",
            "title": "",
            "amount": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;amount')

def test_create_loan_empty_field_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "",
            "title": "",
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyFields;recipient_account_number,title')

def test_create_loan_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': -1.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'negativeAmount')

def test_create_loan_minimum_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 1.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, f"amountTooSmall;{TEST_MIN_LOAN_AMOUNT}")

def test_create_loan_maximum_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 100001.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, f"amountTooBig;{TEST_MAX_LOAN_AMOUNT}")

def test_create_loan_invalid_amount_format(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 1001.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidAmountFormat')

def test_create_loan_sender_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": test_account.account_number,
            "title": "title",
            'amount': 1000.0
        })
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'recipientAccountNotExist')

def test_create_loan_sender_account_not_exist(client, test_user, test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_unauthorised_account):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": test_unauthorised_account.account_number,
            "title": "title",
            'amount': 1000.0
        })
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, 'unauthorisedAccountAccess')

def test_create_loan_sender_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.insert', return_value=None), \
            patch('accounts.account_repository.AccountRepository.update', return_value=None):
        response = client.post('/api/transfer/loan', json={
            "recipient_account_number": test_account.account_number,
            "title": "title",
            'amount': 1000.0
        })
        assert_json_response(response, HTTPStatus.OK, 'loanCreatedSuccessful')
