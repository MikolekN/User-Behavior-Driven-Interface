from unittest.mock import patch

def test_get_cyclic_payment_list_unauthorized(client):
    response = client.get(f'/api/cyclic-payments')
    assert response.status_code == 401

def test_get_cyclic_payment_list_user_not_exist(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "userNotExist"

@patch('users.user_repository.UserRepository.find_by_id')
def test_get_cyclic_payment_list_account_not_exist(mock_user, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user

        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "accountNotExist"

@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
def test_get_cyclic_payment_list_not_exist(mock_account, mock_user, client, test_user, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user
        mock_account.return_value = test_account

        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentListEmpty"

@patch('users.user_repository.UserRepository.find_by_id')
@patch('accounts.account_repository.AccountRepository.find_by_id')
@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_cyclic_payments')
def test_get_cyclic_payment_list_success(mock_find_cyclic_payments, mock_account, mock_user, client, test_user, test_cyclic_payment, test_account):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_user.return_value = test_user
        mock_account.return_value = test_account
        mock_find_cyclic_payments.return_value = [test_cyclic_payment]

        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentListGetSuccessful"
        assert 'cyclic_payments' in json_data
