from unittest.mock import patch

# Not able to mock already logged in status
# def test_logout_success(client):
        
def test_logout_not_logged_in(client):
    response = client.post('/api/logout')
    
    assert response.status_code == 401