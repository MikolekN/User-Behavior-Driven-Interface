from unittest.mock import patch

def test_get_cyclic_payment_list_unauthorized(client):
    response = client.get(f'/api/cyclic-payments')
    assert response.status_code == 401

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_cyclic_payments')
def test_get_cyclic_payment_list_not_exist(mock_find_cyclic_payments, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_cyclic_payments.return_value = None

        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentListEmpty"

@patch('cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_cyclic_payments')
def test_get_cyclic_payment_list_success(mock_find_cyclic_payments, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_cyclic_payments.return_value = [test_cyclic_payment]

        response = client.get(f'/api/cyclic-payments')

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "cyclicPaymentListGetSuccessful"
        assert 'cyclic_payments' in json_data
