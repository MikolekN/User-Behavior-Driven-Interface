import bson

from page_transition_event.constants import BASE_QUICK_ICONS_PREFERENCE
from preferences.preferences import Preferences
from preferences.preferences_repository import PreferencesRepository

preferences_repository = PreferencesRepository()

def prepare_preferences(user_obj_id: bson.ObjectId):
    preferences = preferences_repository.find_by_user(user_obj_id)
    if not preferences:
        preferences: Preferences = Preferences(
            user_id=user_obj_id,
            preferences={
                "quickIconsPreference": BASE_QUICK_ICONS_PREFERENCE,
                "pageTransitionPreference": []
            }
        )
        preferences_repository.insert(preferences)