import { BackendPreferences, Preferences } from "./Preferences";

export interface ShortcutPreference {
    links: string[];
};

export const mapBackendPreferencesToQuickIconsPreferences = (preferencesBackendData: BackendPreferences): ShortcutPreference => {
    return {
        links: preferencesBackendData.preferences.shortcutPreference
    };
};

export const getShortcutPreferencesFromUserPreferences = (userPreferences: Preferences): ShortcutPreference => {
    return {
        links: userPreferences.shortcutPreference
    };
};
