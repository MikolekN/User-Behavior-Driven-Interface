from http import HTTPStatus

import bson
from backend.settings.responses.get_settings_response import GetSettingsResponse
from flask_login import login_required
from shared import create_simple_response

from settings.settings_repository import SettingsRepository

settings_repository = SettingsRepository()


@login_required
def get_settings(user_id: str):
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUserId", HTTPStatus.BAD_REQUEST)
    user_obj_id = bson.ObjectId(user_id)

    settings = settings_repository.find_by_user(user_obj_id)
    if not settings:
        return create_simple_response("noSettings", HTTPStatus.NOT_FOUND)

    return GetSettingsResponse.create_response("settingsFetchSuccessful", settings.to_dict(), HTTPStatus.OK)
