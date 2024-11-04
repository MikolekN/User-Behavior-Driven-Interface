from unittest.mock import MagicMock, patch
from backend.tests.cyclic_payment.constants import DEFAULT_CYCLIC_PAYMENT, TEST_CYCLIC_PAYMENT_ID, TEST_CYCLIC_PAYMENT_INVALID_ID, TEST_NOT_ENOUGH_USER_FUNDS
from backend.tests.cyclic_payment.helpers import get_cyclic_payment, get_cyclic_payment_not_valid

def test_delete_cyclic_payment_unauthorized(client):
    response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
    assert response.status_code == 401

def test_put_cyclic_payment_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Request payload is empty"

def test_put_cyclic_payment_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment_not_valid())

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Fields: 'interval ' are required"

@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_put_cyclic_payment_invalid_object_id(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_INVALID_ID}', json=get_cyclic_payment())

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Invalid Object ID"

@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_put_cyclic_payment_not_exist(mock_find_user_by_id, mock_find_cyclic_payment_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_user_by_id.return_value = test_user
        mock_find_cyclic_payment_by_id.return_value = None

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Cyclic Payment with given ID does not exist"

@patch('backend.users.user_repository.UserRepository.find_by_account_number')
def test_put_cyclic_payment_user_with_account_number_not_exist(mock_find_account_number, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_account_number.return_value = None

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User with given account number does not exist"


@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
def test_put_cyclic_payment_not_enough_money(mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        test_issuer_user.get_available_funds = MagicMock(return_value=TEST_NOT_ENOUGH_USER_FUNDS)
        mock_find_by_account_number.return_value = test_recipient_user

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())

        assert response.status_code == 403
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User does not have enough money"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
@patch('backend.users.user_repository.UserRepository.update')
@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.update_by_id')
def test_put_cyclic_payment_update_not_success(mock_update_cyclic_payment, mock_find_by_id_cyclic_payment, mock_update_user, mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        mock_find_by_account_number.return_value = test_recipient_user
        mock_find_by_id_cyclic_payment.return_value = test_cyclic_payment
        mock_update_cyclic_payment.return_value = None

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Cyclic Payment with given ID does not exist"

        mock_update_user.assert_called_once()

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
@patch('backend.users.user_repository.UserRepository.update')
@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.update_by_id')
def test_put_cyclic_payment_success(mock_update_cyclic_payment, mock_find_by_id_cyclic_payment, mock_update_user, mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        mock_find_by_account_number.return_value = test_recipient_user
        mock_find_by_id_cyclic_payment.return_value = test_cyclic_payment
        mock_update_cyclic_payment.return_value = test_cyclic_payment

        response = client.put(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}', json=get_cyclic_payment())

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Cyclic Payment updated successfully"
        assert 'cyclic_payment' in json_data

        mock_update_user.assert_called_once()
        mock_update_cyclic_payment.assert_called_once()