from unittest.mock import MagicMock, patch

from tests.cyclic_payment.constants import TEST_NEGATIVE_AMOUNT, TEST_NOT_ENOUGH_USER_FUNDS, TEST_AVAILABLE_USER_FUNDS
from tests.transfer.helpers import get_transfer_not_valid, get_transfer


def test_create_transfer_unauthorized(client):
    response = client.post('/api/transfer')
    assert response.status_code == 401

def test_create_transfer_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "emptyRequestPayload"

#TODO: dodać testowanie wysyłania do siebie

def test_create_transfer_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json={"hallo": "hallo"})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "recipientAccountNumberRequired"

        response = client.post('/api/transfer', json={"recipientAccountNumber": ""})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "transferTitleRequired"

        response = client.post('/api/transfer', json={"recipientAccountNumber": "", "transferTitle": ""})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "amountRequired"

def test_create_transfer_negative_amount(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfer', json=get_transfer({'amount': TEST_NEGATIVE_AMOUNT}))

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "negativeAmount"

@patch('users.user_repository.UserRepository.find_by_id')
def test_create_transfer_to_self(mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_user

        response = client.post('/api/transfer', json=get_transfer({'recipientAccountNumber': test_user.account_number}))

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cannotTransferToSelf"


@patch('users.user_repository.UserRepository.find_by_account_number')
@patch('users.user_repository.UserRepository.find_by_id')
def test_create_transfer_recipient_user_not_exist(mock_find_by_id, mock_find_by_account_number, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_account_number.return_value = None
        mock_find_by_id.return_value = test_user

        response = client.post('/api/transfer', json=get_transfer())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userWithAccountNumberNotExist"

@patch('users.user_repository.UserRepository.find_by_id')
@patch('users.user_repository.UserRepository.find_by_account_number')
def test_create_transfer_not_enough_money(mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        test_issuer_user.get_available_funds = MagicMock(return_value=TEST_NOT_ENOUGH_USER_FUNDS)
        mock_find_by_account_number.return_value = test_recipient_user

        response = client.post('/api/transfer', json=get_transfer())

        assert response.status_code == 403
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userDontHaveEnoughMoney"

@patch('users.user_repository.UserRepository.find_by_id')
@patch('users.user_repository.UserRepository.find_by_account_number')
@patch('transfers.transfer_repository.TransferRepository.insert')
def test_create_transfer_success(mock_insert, mock_find_by_account_number, mock_find_by_id, client, test_issuer_user, test_recipient_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_by_id.return_value = test_issuer_user
        test_issuer_user.get_available_funds = MagicMock(return_value=TEST_AVAILABLE_USER_FUNDS)
        mock_find_by_account_number.return_value = test_recipient_user
        mock_insert.return_value = None

        response = client.post('/api/transfer', json=get_transfer())

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "transferCreatedSuccessful"
