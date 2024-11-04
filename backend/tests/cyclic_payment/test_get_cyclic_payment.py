from unittest.mock import MagicMock, patch
from backend.tests.cyclic_payment.constants import DEFAULT_CYCLIC_PAYMENT, TEST_CYCLIC_PAYMENT_ID, TEST_CYCLIC_PAYMENT_INVALID_ID

def test_get_cyclic_payment_unauthorized(client):
    response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')
    assert response.status_code == 401

@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_invalid_object_id(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_INVALID_ID}')

        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Invalid Object ID"

@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_not_exist(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = None

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Cyclic Payment with given ID does not exist"

@patch('backend.cyclic_payments.cyclic_payment_repository.CyclicPaymentRepository.find_by_id')
def test_get_cyclic_payment_success(mock_find_by_id, client, test_user, test_cyclic_payment):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = test_cyclic_payment

        response = client.get(f'/api/cyclic-payment/{TEST_CYCLIC_PAYMENT_ID}')

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Get Cyclic Payment by id successfully"
        assert 'cyclic_payment' in json_data

