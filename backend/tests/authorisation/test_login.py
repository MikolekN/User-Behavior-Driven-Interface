from unittest.mock import patch
from ..constants import TEST_EMAIL, TEST_PASSWORD

def test_login_success(client, test_user):
    with patch('backend.users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Logged in successfully"
        assert 'user' in json_data

def test_login_already_logged_in(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })

        assert response.status_code == 409
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Already logged in"

def test_login_user_not_exist(client):
    with patch('backend.users.user_repository.UserRepository.find_by_email', return_value=None):
        response = client.post('/api/login', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })

        assert response.status_code == 404
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "User does not exist"

def test_login_invalid_password(client, test_user):
    with patch('backend.users.user_repository.UserRepository.find_by_email', return_value=test_user):
        response = client.post('/api/login', json={
            'email': TEST_EMAIL,
            'password': "WrongPassword123"
        })

        assert response.status_code == 401
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Invalid login credentials"

def test_login_empty_data(client):
    response = client.post('/api/login', json={})
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == "Request payload is empty"

def test_login_invalid_data(client):
    response = client.post('/api/login', json={
        'email': TEST_EMAIL,
    })
    
    assert response.status_code == 400
    json_data = response.get_json()
    assert 'message' in json_data
    assert json_data['message'] == "Email and password fields are required"
    
