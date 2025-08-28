import os
import uuid
from http import HTTPStatus

from PIL import Image
from flask import Response, request, Request
from flask_login import login_required, current_user
from werkzeug.datastructures import FileStorage

from constants import UPLOAD_FOLDER
from routes.helpers import create_simple_response, allowed_file_extension
from users import UserRepository, User

user_repository = UserRepository()


@login_required
def upload_user_icon() -> Response:
    ensure_upload_folder_exists()

    validation_result = validate_icon_file(request)
    if isinstance(validation_result, Response):
        return validation_result
    icon: FileStorage = validation_result

    user_data: User = user_repository.find_by_id(current_user.get_id())
    if user_data:
        remove_old_icon(user_data.to_dict())

    unique_filename = f"{uuid.uuid4().hex}.png"
    icon_path = os.path.join(UPLOAD_FOLDER, unique_filename)

    try:
        process_and_save_icon(icon, icon_path)
    except Exception as e:
        return create_simple_response(f"errorImageProcess;{str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)

    user_repository.update(current_user.get_id(), {'user_icon': icon_path})

    return create_simple_response("iconUploadSuccessful", HTTPStatus.OK)


def ensure_upload_folder_exists() -> None:
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)


def validate_icon_file(request: Request) -> Response | FileStorage:
    if 'icon' not in request.files:
        return create_simple_response("fileRequired", HTTPStatus.BAD_REQUEST)

    icon: FileStorage | None = request.files['icon']
    if icon is None or icon.filename == '':
        return create_simple_response("iconNotInRequest", HTTPStatus.BAD_REQUEST)

    if not allowed_file_extension(icon.filename):
        return create_simple_response("invalidFileType", HTTPStatus.BAD_REQUEST)

    return icon


def remove_old_icon(user_data: dict) -> None:
    old_icon_path = user_data.get('user_icon')
    if old_icon_path and os.path.exists(old_icon_path):
        os.remove(old_icon_path)


def process_and_save_icon(icon: FileStorage, save_path: str) -> None:
    image = Image.open(icon)
    width, height = image.size
    if width > 120 or height > 120:
        image = image.resize((120, 120))
    image.save(save_path)
