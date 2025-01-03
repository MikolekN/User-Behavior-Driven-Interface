from unittest.mock import patch
from backend.tests.transfer.constants import DEFAULT_TRANSFER_LOAN, DEFAULT_TRANSFER_LOAN_NOT_THOUSANDS, DEFAULT_TRANSFER_LOAN_TOO_BIG, DEFAULT_TRANSFER_LOAN_TOO_LOW, TEST_MAX_LOAN_AMOUNT, TEST_MIN_LOAN_AMOUNT
from backend.tests.transfer.helpers import get_transfer_not_valid

def test_create_transfer_loan_unauthorized(client):
    response = client.post('/api/transfer/loan')
    assert response.status_code == 401

def test_create_transfer_loan_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Request payload is empty"

def test_create_transfer_loan_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json=get_transfer_not_valid())

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "All fields are required"

def test_create_transfer_loan_amount_too_low(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN_TOO_LOW)

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == f"Amount must be bigger or equal to {TEST_MIN_LOAN_AMOUNT}"

def test_create_transfer_loan_amount_too_big(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN_TOO_BIG)

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == f"Amount must be lower or equal to {TEST_MAX_LOAN_AMOUNT}"

def test_create_transfer_loan_amount_not_thousands(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN_NOT_THOUSANDS)

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Invalid amount format. Provide amount in thousands"

@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_create_transfer_loan_recipient_user_not_exist(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = None

        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN)

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User with given account number does not exist"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.find_by_account_number')
def test_create_transfer_loan_bank_not_exist(mock_find_bank_by_account_number, mock_find_user_by_id, client, test_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_bank_by_account_number.return_value = None
        mock_find_user_by_id.return_value = test_recipient_user

        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN)

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Bank user account does not exist"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.update')
def test_create_transfer_loan_success(mock_update_user, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_recipient_user

        response = client.post('/api/transfer/loan', json=DEFAULT_TRANSFER_LOAN)

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Loan made successfully"

        mock_update_user.assert_called_once()
