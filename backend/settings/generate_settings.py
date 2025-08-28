import bson

from settings.settings import Settings
from settings.settings_repository import SettingsRepository

settings_repository = SettingsRepository()


def generate_default_settings(user_obj_id: bson.ObjectId):
    settings = settings_repository.find_by_user(user_obj_id)
    if not settings:
        settings: Settings = Settings(
            user_id=user_obj_id,
            settings={
                "preferencesSettings": {
                    "areEventsCollected": True,
                    "isShortcutVisible": True,
                    "isNextStepVisible": True,
                    "isQuickIconsVisible": True,
                    "isMenuPriorityVisible": True
                },
                "appSettings": {}
            }
        )
        settings_repository.insert(settings)
    return settings
