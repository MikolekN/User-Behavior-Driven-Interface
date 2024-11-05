from unittest.mock import patch
from backend.tests.transfer.helpers import get_transfer

def test_get_transfers_unauthorized(client):
    response = client.get('/api/transfers')
    assert response.status_code == 401

@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_not_exist(mock_find_transfers, client, test_user):    
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.get('/api/transfers', json=get_transfer())

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Transfers list for current user is empty"


@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_get_transfers_success(mock_find_user_by_id, mock_find_transfers, client, test_issuer_user, test_transfers, test_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_transfers.return_value = test_transfers
        mock_find_user_by_id.return_value = test_user

        response = client.get('/api/transfers', json=get_transfer())

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Transfers returned successfully"
        assert 'transfers' in json_data