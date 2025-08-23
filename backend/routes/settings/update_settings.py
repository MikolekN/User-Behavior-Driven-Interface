from http import HTTPStatus

import bson
from flask import Response, request
from flask_login import login_required
from shared import create_simple_response

from settings.responses.update_settings_response import UpdateSettingsResponse
from settings.requests.update_settings_request import UpdateSettingsRequest
from settings.responses.get_settings_response import GetSettingsResponse
from settings.settings_repository import SettingsRepository

settings_repository = SettingsRepository()

@login_required
def update_settings(user_id: str):
    if not isinstance(user_id, str) or not bson.ObjectId.is_valid(user_id):
        return create_simple_response("invalidUserId", HTTPStatus.BAD_REQUEST)
    
    data = request.get_json()
    print(data)
    error = UpdateSettingsRequest.validate_request(data)
    if error:
        return create_simple_response(error, HTTPStatus.BAD_REQUEST)

    user_obj_id = bson.ObjectId(user_id)
    settings = settings_repository.find_by_user(user_obj_id)
    if not settings:
        return create_simple_response("settingsNotExist", HTTPStatus.NOT_FOUND)

    data = data['settings']
    data_for_update = {
        "settings": {
            "appSettings": data['appSettings'],
            "preferencesSettings": {
                "areEventsCollected": data['preferencesSettings']['areEventsCollected'],
                "isShortcutVisible": data['preferencesSettings']['isShortcutVisible'],
                "isNextStepVisible": data['preferencesSettings']['isNextStepVisible'],
                "isQuickIconsVisible": data['preferencesSettings']['isQuickIconsVisible'],
                "isMenuPriorityVisible": data['preferencesSettings']['isMenuPriorityVisible']
            }
        }
    }

    updated_settings = settings_repository.update(str(settings.id), data_for_update)
    print(updated_settings)
    return UpdateSettingsResponse.create_response("updatedSettingsSuccessfully", updated_settings.to_dict(), HTTPStatus.OK)
