from http import HTTPStatus
from unittest.mock import MagicMock, patch

from tests.cyclic_payment.constants import TEST_NEGATIVE_AMOUNT, TEST_NOT_ENOUGH_USER_FUNDS, TEST_AVAILABLE_USER_FUNDS
from tests.cyclic_payment.helpers import get_cyclic_payment_not_valid, get_cyclic_payment
from utils import assert_json_response


def test_create_cyclic_payment_unauthorized(client):
    response = client.post('/api/cyclic-payment')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_create_cyclic_payment_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

def test_create_cyclic_payment_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment_not_valid())
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;interval')

def test_create_cyclic_payment_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment({'amount': TEST_NEGATIVE_AMOUNT}))
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'negativeAmount')

def test_create_cyclic_payment_invalid_date_format(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment({'start_date': 'notValidStartDate'}))
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidDateFormat')

def test_create_cyclic_payment_recipient_user_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'userNotExist')


@patch('users.user_repository.UserRepository.find_by_id')
def test_create_cyclic_payment_recipient_account_not_exist(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_user

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'accountNotExist')

@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_account_number')
def test_create_cyclic_payment_recipient_account_not_enough_money(mock_another_account, mock_account, mock_user, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user
        mock_account.return_value = test_account
        mock_another_account.return_value = test_account
        test_account.get_available_funds = MagicMock(return_value=TEST_NOT_ENOUGH_USER_FUNDS)

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'accountDontHaveEnoughMoney')

@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_account_number')
@patch('accounts.account_repository.AccountRepository.update')
@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.insert')
def test_create_cyclic_payment_recipient_account_not_enough_money(mock_insert, mock_update, mock_another_account, mock_account, mock_user, client, test_user, test_cyclic_payment, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user
        mock_account.return_value = test_account
        mock_another_account.return_value = test_account
        mock_insert.return_value = test_cyclic_payment
        mock_update.return_value = None

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.CREATED, 'cyclicPaymentCreatedSuccessful')
