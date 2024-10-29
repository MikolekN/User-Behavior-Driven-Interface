from unittest.mock import patch
from ..constants import TEST_EMAIL, TEST_PASSWORD

def test_register_already_logged_in(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/register', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })
    
        assert response.status_code == 409
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Already logged in"

def test_register_empty_data(client):
    response = client.post('/api/register', json={})
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == "Request payload is empty"

def test_register_invalid_data(client):
    response = client.post('/api/register', json={
        'email': TEST_EMAIL,
    })
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == "Email and password fields are required"
    
def test_register_already_exists(client, test_user):
    with patch('backend.users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/register', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })
        
        assert response.status_code == 409
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User already exists"
    

def test_register_success(client):
    with patch('backend.users.user_repository.UserRepository.find_by_email', return_value=None):
        response = client.post('/api/register', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })
        
        assert response.status_code == 201
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User registered successfully"
        assert 'user' in json_data
