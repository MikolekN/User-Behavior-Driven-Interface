from http import HTTPStatus
from unittest.mock import patch

from utils import assert_json_response


def test_logout_when_not_logged_in(client):
    response = client.post('/api/logout')
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_logout_success(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/logout')
        assert_json_response(response, HTTPStatus.OK, 'logoutSuccessful')
