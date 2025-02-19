from http import HTTPStatus
from unittest.mock import patch

from tests.transfer.constants import TEST_YEAR
from utils import assert_json_response


def test_get_transfers_monthly_analysis_unauthorized(client):
    response = client.post('/api/transfers/analysis/monthly')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_get_transfers_monthly_analysis_empty_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyRequestPayload')

def test_get_transfers_monthly_analysis_missing_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={'invalid_field': "invalid"})
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'missingFields;year')

def test_get_transfers_monthly_analysis_extra_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={
            'year': "",
            'invalid_field': "invalid"
        })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'extraFields;invalid_field')

def test_get_transfers_monthly_analysis_invalid_data(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={ 'year': 0 })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'invalidTypeFields;year')

def test_get_transfers_monthly_analysis_empty_field(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={ 'year': "" })
        assert_json_response(response, HTTPStatus.BAD_REQUEST, 'emptyFields;year')

def test_get_transfers_monthly_analysis_user_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'userNotExist')

@patch('users.user_repository.UserRepository.find_by_id')
def test_get_transfers_monthly_analysis_account_not_exist(mock_user, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'accountNotExist')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_transfers_monthly_analysis_not_exist(mock_account, mock_user, mock_find_transfers, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = None
        mock_user.return_value = test_user
        mock_account.return_value = test_account

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})
        assert_json_response(response, HTTPStatus.NOT_FOUND, 'monthlyAnalysisEmpty')

@patch('transfers.transfer_repository.TransferRepository.find_transfers')
@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_transfers_monthly_analysis_success(mock_account, mock_find_user_by_id, mock_find_transfers, client, test_transfers, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_transfers.return_value = test_transfers
        mock_find_user_by_id.return_value = test_user
        mock_account.return_value = test_account

        response = client.post('/api/transfers/analysis/monthly', json={'year': TEST_YEAR})
        json_data = assert_json_response(response, HTTPStatus.OK, 'monthlyAnalysisSuccessful')
        assert 'transfers' in json_data
