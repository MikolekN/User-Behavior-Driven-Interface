from http import HTTPStatus
from unittest.mock import patch

from tests.cyclic_payment.constants import TEST_CYCLIC_PAYMENT_ID, TEST_CYCLIC_PAYMENT_INVALID_ID
from tests.cyclic_payment.helpers import get_cyclic_payment_not_valid, get_cyclic_payment
from utils import assert_json_response


def test_put_cyclic_payment_unauthorized(client):
    response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


def test_put_cyclic_payment_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')


def test_put_cyclic_payment_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment_not_valid())
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;interval')


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_put_cyclic_payment_invalid_object_id(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_INVALID_ID}', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.BAD_REQUEST, "invalidObjectId")


def test_put_cyclic_payment_account_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.NOT_FOUND, "accountNotExist")


@patch('accounts.account_repository.AccountRepository.find_by_account_number')
def test_put_cyclic_payment_user_not_exist(mock_account, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_account.return_value = test_account

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.NOT_FOUND, "userWithAccountNumberNotExist")


@patch('accounts.account_repository.AccountRepository.find_by_account_number')
@patch('users.user_repository.UserRepository.find_by_id')
def test_put_cyclic_payment_not_exist(mock_user, mock_account, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_account.return_value = test_account
        mock_user.return_value = test_user

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.NOT_FOUND, "cyclicPaymentNotExist")


@patch('accounts.account_repository.AccountRepository.find_by_account_number')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('users.user_repository.UserRepository.find_by_id')
@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.update')
def test_put_cyclic_payment_unauthorised(mock_another_cp, mock_cp, mock_user, mock_another_account, mock_account,
                                         client, test_user, test_account, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_another_account.return_value = test_account
        mock_account.return_value = test_account
        mock_user.return_value = test_user
        mock_cp.return_value = test_cyclic_payment
        mock_another_cp.return_value = test_cyclic_payment

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())
        assert_json_response(response, HTTPStatus.OK, "cyclicPaymentUpdatedSuccessful")
