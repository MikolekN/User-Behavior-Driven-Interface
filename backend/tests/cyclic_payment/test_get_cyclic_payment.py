from unittest.mock import patch

from tests.cyclic_payment.constants import TEST_CYCLIC_PAYMENT_ID, TEST_CYCLIC_PAYMENT_INVALID_ID


def test_get_cyclic_payment_unauthorized(client):
    response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
    assert response.status_code == 401

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_invalid_object_id(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_INVALID_ID}')

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "invalidObjectId"

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_not_exist(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = None

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentNotExist"

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_account_not_exist(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "accountNotExist"

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_cyclic_payment_success(mock_account, mock_find_by_id, client, test_user, test_cyclic_payment, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment
        mock_account.return_value = test_account

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userNotExist"
        assert 'cyclic_payment' in json_data

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('users.user_repository.UserRepository.find_by_id')
def test_get_cyclic_payment_success(mock_user, mock_account, mock_find_by_id, client, test_user, test_cyclic_payment, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment
        mock_account.return_value = test_account
        mock_user.return_value = test_user

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentGetSuccessful"
        assert 'cyclic_payment' in json_data
