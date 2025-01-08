from http import HTTPStatus
from unittest.mock import patch

from tests.transfer.constants import TEST_YEAR_INVALID, TEST_YEAR
from utils import assert_json_response


def test_get_transfers_yearly_analysis_unauthorized(client):
    response = client.post('/api/transfers/analysis/yearly')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_empty_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_invalid_data(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'invalid_field': "invalid"})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'startEndYearRequired')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_invalid_data_type(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR_INVALID, 'endYear': TEST_YEAR_INVALID})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidStartEndYearType')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
def test_get_transfers_yearly_analysis_user_not_exist(mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'userNotExist')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
def test_get_transfers_yearly_analysis_account_not_exist(mock_user, mock_find_transfers, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None
        mock_user.return_value = test_user

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'accountNotExist')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_transfers_yearly_analysis_not_exist(mock_account, mock_user, mock_find_transfers, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None
        mock_user.return_value = test_user
        mock_account.return_value = test_account

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'yearlyAnalysisEmpty')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_transfers_yearly_analysis_success(mock_account, mock_user, mock_find_transfers, client, test_user, test_transfers, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = test_transfers
        mock_user.return_value = test_user
        mock_account.return_value = test_account

        response = client.post('/api/transfers/analysis/yearly', json={'startYear': TEST_YEAR, 'endYear': TEST_YEAR})
        json_data = assert_json_response(response, HTTPStatus.OK, 'yearlyAnalysisSuccessful')
        assert 'transfers' in json_data
