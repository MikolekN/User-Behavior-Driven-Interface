import os
import uuid

from PIL import Image
from flask import Blueprint, request, Response, send_file, Request
from flask_login import current_user, login_required
from werkzeug.datastructures import FileStorage

from constants import UPLOAD_FOLDER
from routes.helpers import allowed_file_extension, create_simple_response
from users import UserRepository, User

user_icon_blueprint = Blueprint('user_icon', __name__, url_prefix='/api')

user_repository = UserRepository()


def ensure_upload_folder_exists() -> None:
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def validate_icon_file(request: Request) -> tuple[Response, int] | FileStorage:
    if 'icon' not in request.files:
        return create_simple_response("fileRequired", 400)

    icon: FileStorage | None = request.files['icon']
    if icon is None or icon.filename == '':
        return create_simple_response("iconNotInRequest", 400)

    if not allowed_file_extension(icon.filename):
        return create_simple_response("invalidFileType", 400)

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

@user_icon_blueprint.route('/user/icon', methods=['POST'])
@login_required
def upload_user_icon() -> tuple[Response, int]:
    ensure_upload_folder_exists()

    # Validate the uploaded icon
    validation_result = validate_icon_file(request)
    if isinstance(validation_result, tuple):
        return validation_result
    icon: FileStorage = validation_result

    # Fetch user data and remove old icon if it exists
    user_data = user_repository.find_by_id(current_user._id)
    if user_data:
        remove_old_icon(user_data)

    # Generate a unique filename and determine the save path
    unique_filename = f"{uuid.uuid4().hex}.png"
    icon_path = os.path.join(UPLOAD_FOLDER, unique_filename)

    # Process and save the new icon
    try:
        process_and_save_icon(icon, icon_path)
    except Exception as e:
        return create_simple_response(f"errorImageProcess;{str(e)}", 500)

    user_repository.update(current_user._id, {'user_icon': icon_path})

    return create_simple_response("iconUploadSuccessful", 200)

def get_user_data_and_icon_path(user_id: str) -> tuple[dict | None, str | None]:
    user_data: User = user_repository.find_by_id(user_id)
    if not user_data or not user_data.user_icon:
        return None, None
    return user_data.to_dict(), user_data.user_icon

def validate_icon_path(icon_path: str) -> tuple[bool, str | None]:
    if not os.path.exists(icon_path):
        return False, "iconUserNotFound"
    return True, None

@user_icon_blueprint.route('/user/icon', methods=['GET'])
@login_required
def get_user_icon() -> tuple[Response, int]:
    # Retrieve user data and icon path
    user_data, icon_path = get_user_data_and_icon_path(current_user._id)
    if not user_data or not icon_path:
        return create_simple_response("iconNotSetForUser", 404)

    # Validate the icon path
    is_valid, error_message = validate_icon_path(icon_path)
    if not is_valid:
        return create_simple_response(error_message, 404)

    # Attempt to send the icon file
    try:
        return send_file(icon_path, mimetype='image/png'), 200
    except Exception as e:
        return create_simple_response(f"sendIconFailed;{str(e)}", 500)
