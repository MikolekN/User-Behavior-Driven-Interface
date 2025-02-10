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

def test_create_transfer_missing_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={"hallo": "hallo"})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;sender_account_number,recipient_account_number,title,amount')

        response = client.post('/api/transfer', json={"sender_account_number": ""})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;recipient_account_number,title,amount')

        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;title,amount')

        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": "",
            "title": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;amount')

def test_create_transfer_extra_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": "",
            "title": "",
            "amount": 0,
            "hallo": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'extraFields;hallo')

def test_create_transfer_invalid_sender_account_number_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": 5,
            "recipient_account_number": "",
            "title": "",
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;sender_account_number')

def test_create_transfer_invalid_recipient_account_number_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": 5,
            "title": "",
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;recipient_account_number')

def test_create_transfer_invalid_title_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": "",
            "title": 5,
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;title')

def test_create_transfer_invalid_amount_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": "",
            "title": "",
            "amount": ""
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;amount')

def test_create_transfer_empty_field_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "",
            "recipient_account_number": "",
            "title": "",
            "amount": 0.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyFields;sender_account_number,recipient_account_number,title')

def test_create_transfer_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': -1.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'negativeAmount')

def test_create_transfer_to_self(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "sender_account_number",
            "title": "title",
            'amount': 1.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'cannotTransferToSelf')

def test_create_transfer_sender_account_not_exist(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=None):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 1.0
        })
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'senderAccountNotExist')


# TODO: simplify tests - e.g. one function for all

def test_create_transfer_unauthorised(client, test_user, test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_unauthorised_account):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 1.0
        })
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, 'unauthorisedAccountAccess')

def test_create_transfer_not_enough_money(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 10_001.0
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'accountDontHaveEnoughMoney')

def test_create_transfer_successful(client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user), \
            patch('accounts.account_repository.AccountRepository.find_by_account_number', return_value=test_account), \
            patch('transfers.transfer_repository.TransferRepository.insert', return_value=None), \
            patch('accounts.account_repository.AccountRepository.update', return_value=None):
        response = client.post('/api/transfer', json={
            "sender_account_number": "sender_account_number",
            "recipient_account_number": "recipient_account_number",
            "title": "title",
            'amount': 1.0
        })
        assert_json_response(response, HTTPStatus.OK, 'transferCreatedSuccessful')
