from http import HTTPStatus
from unittest.mock import patch

from tests.cyclic_payment.constants import TEST_CYCLIC_PAYMENT_ID, TEST_CYCLIC_PAYMENT_INVALID_ID
from utils import assert_json_response


def test_delete_cyclic_payment_unauthorized(client):
    response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_delete_cyclic_payment_invalid_object_id(mock_cp, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_cp.return_value = test_cyclic_payment

        response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_INVALID_ID}')
        assert_json_response(response, HTTPStatus.BAD_REQUEST, "invalidObjectId")


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_delete_cyclic_payment_not_exist(mock_cp, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_cp.return_value = None

        response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
        assert_json_response(response, HTTPStatus.NOT_FOUND, "cyclicPaymentNotExist")


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_delete_cyclic_payment_account_not_exist(mock_account, mock_cp, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_cp.return_value = test_cyclic_payment
        mock_account.return_value = None

        response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
        assert_json_response(response, HTTPStatus.NOT_FOUND, "accountNotExist")


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_delete_cyclic_payment_unauthorised(mock_account, mock_cp, client, test_user, test_cyclic_payment,
                                            test_unauthorised_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_cp.return_value = test_cyclic_payment
        mock_account.return_value = test_unauthorised_account

        response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
        assert_json_response(response, HTTPStatus.UNAUTHORIZED, "unauthorisedAccountAccess")


@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.update')
@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.delete')
def test_delete_cyclic_payment_success(mock_delete, mock_update, mock_account, mock_cp, client, test_user,
                                       test_cyclic_payment, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_cp.return_value = test_cyclic_payment
        mock_account.return_value = test_account
        mock_update.return_value = None
        mock_delete.return_value = None

        response = client.delete(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
        assert_json_response(response, HTTPStatus.OK, "cyclicPaymentDeletedSuccessful")
