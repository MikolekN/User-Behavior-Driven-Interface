from io import BytesIO
from unittest.mock import MagicMock, patch

def test_upload_user_icon_not_logged_in(client):
    response = client.post('/api/user/icon')
    assert response.status_code == 401

def test_upload_user_icon_no_file_in_request(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/user/icon')
    
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "No files in the request"

def test_upload_user_icon_missing_icon_file(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        data = {'icon': (BytesIO(b''), '')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Icon missing in the request"

def test_upload_user_icon_invalid_file_type(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        data = {'icon': (BytesIO(b'Fake file content'), 'icon.txt')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')
        
        assert response.status_code == 400
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "File type not allowed"

@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('PIL.Image.open')
def test_upload_user_icon_image_processing_fail(mock_image_open, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_find_by_id.return_value = MagicMock(user_icon=None)
        mock_image_open.side_effect = Exception("Image processing error")

        data = {'icon': (BytesIO(b'fake-image-data'), 'icon.png')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == 500
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Image processing failed: Image processing error"
    
@patch('backend.users.user_repository.UserRepository.find_by_id')
@patch('backend.users.user_repository.UserRepository.update')
@patch('PIL.Image.open')
def test_upload_user_icon_success(mock_image_open, mock_update, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_image = MagicMock()
        mock_image.size = (100, 100)
        mock_image_open.return_value = mock_image
        mock_find_by_id.return_value = MagicMock(user_icon=None)
        mock_update.return_value = True

        data = {'icon': (BytesIO(b'fake-image-data'), 'icon.png')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == 200
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "Icon uploaded successfully"