from unittest.mock import MagicMock, patch
from backend.tests.cyclic_payment.constants import TEST_AVAILABLE_USER_FUNDS, TEST_NEGATIVE_AMOUNT, TEST_NOT_ENOUGH_USER_FUNDS
from backend.tests.cyclic_payment.helpers import get_cyclic_payment, get_cyclic_payment_not_valid

def test_create_cyclic_payment_unauthorized(client):
    response = client.post('/api/cyclic-payment')
    assert response.status_code == 401

def test_create_cyclic_payment_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Request payload is empty"

def test_create_cyclic_payment_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment_not_valid())

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Fields: 'interval ' are required"

def test_create_cyclic_payment_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment({'amount': TEST_NEGATIVE_AMOUNT}))

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Amount must be a positive number"

def test_create_cyclic_payment_invalid_date_format(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/cyclic-payment', json=get_cyclic_payment({'startDate': 'notValidStartDate'}))

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Invalid date format. Expected ISO 8601 format"

@patch('backend.users.user_repository.UserRepository.find_by_account_number')
def test_create_cyclic_payment_recipient_user_not_exist(mock_find_by_account_number, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_account_number.return_value = None

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User with given account number does not exist"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
def test_create_cyclic_payment_not_enough_money(mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        test_issuer_user.get_available_funds = MagicMock(return_value=TEST_NOT_ENOUGH_USER_FUNDS)
        mock_find_by_account_number.return_value = test_recipient_user

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())

        assert response.status_code == 403
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User does not have enough money"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
@patch('backend.users.user_repository.UserRepository.update')
def test_create_cyclic_payment_success(mock_update, mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        test_issuer_user.get_available_funds = MagicMock(return_value=TEST_AVAILABLE_USER_FUNDS)
        mock_find_by_account_number.return_value = test_recipient_user

        response = client.post('/api/cyclic-payment', json=get_cyclic_payment())

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Cyclic Payment created successfully"
        assert 'cyclic_payment' in json_data

        mock_update.assert_called_once()
