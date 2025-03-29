import { BackendPreferences, Preferences } from "./Preferences";

export interface QuickIconsPreference {
    elementId: string;
};

export const mapBackendPreferencesToQuickIconsPreferences = (preferencesBackendData: BackendPreferences): QuickIconsPreference => {
    return {
        elementId: preferencesBackendData.preferences.quickIconsPreference
    };
};

export const getQuickIconsPreferencesFromUserPreferences = (userPreferences: Preferences): QuickIconsPreference => {
    return {
        elementId: userPreferences.quickIconsPreference
    };
};
