from unittest.mock import patch
from backend.tests.transfer.constants import TEST_YEAR, TEST_YEAR_INVALID

def test_get_transfers_monthly_analysis_unauthorized(client):
    response = client.post('/api/transfers/analysis/monthly')
    assert response.status_code == 401

@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_monthly_analysis_empty_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/monthly', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Request payload is empty"

@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_monthly_analysis_invalid_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/monthly', json={'invalid_field': "invalid"})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Year must be provided"

@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_monthly_analysis_invalid_data_type(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR_INVALID})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Year has to be of type integer"

@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_monthly_analysis_not_exist(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Monthly transfers analysis for current user is empty"


@patch('backend.transfers.transfer_repository.TransferRepository.find_transfers')
@patch('backend.users.user_repository.UserRepository.find_by_id')
def test_get_transfers_monthly_analysis_success(mock_find_user_by_id, mock_find_transfers, client, test_issuer_user, test_transfers_for_analysis, test_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_transfers.return_value = test_transfers_for_analysis
        mock_find_user_by_id.return_value = test_user

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Transfers monthly analysis returned successfully"
        assert 'transfers' in json_data
