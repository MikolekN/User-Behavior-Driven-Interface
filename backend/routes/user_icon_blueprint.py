from flask import Blueprint, request, jsonify, Response, current_app, send_file
from flask_login import current_user, login_required
from users.user_repository import UserRepository
from werkzeug.datastructures import FileStorage
from PIL import Image

import uuid
import os

user_icon_blueprint = Blueprint('user_icon', __name__, url_prefix='/api')

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@user_icon_blueprint.route('/user/icon', methods=['POST'])
@login_required
def upload_user_icon() -> tuple[Response, int]:
    if not os.path.exists(current_app.config['UPLOAD_FOLDER']):
        os.makedirs(current_app.config['UPLOAD_FOLDER'])
    
    if 'icon' not in request.files:
        return jsonify(message="No files in the request"), 400

    icon: FileStorage | None = request.files['icon']
    if icon is None or icon.filename == '':
        return jsonify(message="Icon missing in the request"), 400

    if icon and allowed_file(icon.filename):
        user_data = UserRepository.find_by_id(current_user._id)
        if user_data and user_data.user_icon:
            old_icon_path = user_data.user_icon
            if os.path.exists(old_icon_path):
                os.remove(old_icon_path)

        unique_filename = f"{uuid.uuid4().hex}.png"
        icon_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)

        try:
            image = Image.open(icon)
            width, height = image.size
            if width > 120 or height > 120:
                image = image.resize((120, 120))
            image.save(icon_path)
        except Exception as e:
            return jsonify(message=f"Image processing failed: {str(e)}"), 500

        UserRepository.update(current_user._id, {'user_icon': icon_path})

        return jsonify(message="Icon uploaded successfully"), 200

    return jsonify(message="File type not allowed"), 400

@user_icon_blueprint.route('/user/icon', methods=['GET'])
@login_required
def get_user_icon() -> tuple[Response, int]:
    user_data = UserRepository.find_by_id(current_user._id)
    if user_data and user_data.user_icon:
        icon_path = user_data.user_icon
        if os.path.exists(icon_path):
            try:
                return send_file(icon_path, mimetype='image/png')
            except Exception as e:
                return jsonify(message=f"Failed to send the icon: {str(e)}"), 500
        else:
            return jsonify(message="User icon file not found"), 404
    return jsonify(message="No icon set for this user"), 404