from unittest.mock import patch

from tests.transfer.constants import TEST_YEAR_INVALID, TEST_YEAR


def test_get_transfers_yearly_analysis_unauthorized(client):
    response = client.post('/api/transfers/analysis/yearly')
    assert response.status_code == 401

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_empty_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "emptyRequestPayload"

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_invalid_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'invalid_field': "invalid"})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "startEndYearRequired"

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_invalid_data_type(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR_INVALID, 'endYear': TEST_YEAR_INVALID})

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "invalidStartEndYearType"

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_not_exist(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "yearlyAnalysisEmpty"


@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
def test_get_transfers_yearly_analysis_success(mock_find_user_by_id, mock_find_transfers, client, test_issuer_user, test_transfers_for_analysis, test_user):
    with patch('flask_login.utils._get_user', return_value=test_issuer_user):
        mock_find_transfers.return_value = test_transfers_for_analysis
        mock_find_user_by_id.return_value = test_user

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "yearlyAnalysisSuccessful"
        assert 'transfers' in json_data
