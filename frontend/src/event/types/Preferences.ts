export interface Preferences {
    pageTransitionPreference: string[];
    quickIconsPreference: string;
}

export interface BackendPreferences {
    user_id: string;
    preferences: Preferences;
};

export const mapBackendPreferencesToUserPreferences = (preferencesBackendData: BackendPreferences): Preferences => {
    return {
        pageTransitionPreference: preferencesBackendData.preferences.pageTransitionPreference,
        quickIconsPreference: preferencesBackendData.preferences.quickIconsPreference
    };
};