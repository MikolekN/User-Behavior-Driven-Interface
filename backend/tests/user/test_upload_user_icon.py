from http import HTTPStatus
from io import BytesIO
from unittest.mock import MagicMock, patch


def test_upload_user_icon_not_logged_in(client):
    response = client.post('/api/user/icon')
    assert response.status_code == HTTPStatus.UNAUTHORIZED


def test_upload_user_icon_no_file_in_request(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        response = client.post('/api/user/icon')

        assert response.status_code == HTTPStatus.BAD_REQUEST
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "fileRequired"


def test_upload_user_icon_missing_icon_file(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        data = {'icon': (BytesIO(b''), '')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == HTTPStatus.BAD_REQUEST
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "iconNotInRequest"


def test_upload_user_icon_invalid_file_type(client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        data = {'icon': (BytesIO(b'Fake file content'), 'icon.txt')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == HTTPStatus.BAD_REQUEST
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "invalidFileType"


@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon=None))
@patch('PIL.Image.open', side_effect=Exception("Image processing error"))
def test_upload_user_icon_image_processing_fail(mock_image_open, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        data = {'icon': (BytesIO(b'fake-image-data'), 'icon.png')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "errorImageProcess;Image processing error"


@patch('backend.users.user_repository.UserRepository.find_by_id', return_value=MagicMock(user_icon=None))
@patch('backend.users.user_repository.UserRepository.update', return_value=True)
@patch('PIL.Image.open')
def test_upload_user_icon_success(mock_image_open, mock_update, mock_find_by_id, client, test_user):
    with patch('flask_login.utils._get_user', return_value=test_user):
        mock_image = MagicMock()
        mock_image.size = (100, 100)
        mock_image_open.return_value = mock_image

        data = {'icon': (BytesIO(b'fake-image-data'), 'icon.png')}
        response = client.post('/api/user/icon', data=data, content_type='multipart/form-data')

        assert response.status_code == HTTPStatus.OK
        json_data = response.get_json()
        assert 'message' in json_data
        assert json_data['message'] == "iconUploadSuccessful"
