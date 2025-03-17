export interface BackendPreferences {
    user_id: string;
    preferences: Record<string, string>;
};

export interface QuickIconsPreference {
    elementId: string;
};

export const mapBackendPreferencesToQuickIconsPreferences = (preferencesBackendData: BackendPreferences): QuickIconsPreference => {
    return {
        elementId: preferencesBackendData.preferences['quickIconsPreference']
    };
};
