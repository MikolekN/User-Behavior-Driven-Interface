interface AutoRedirectPreferenceData {
    accountForm: string;
    accountFormEdit: string;
    cardForm: string;
    cardFormEdit: string;
    cyclicPaymentForm: string;
    cyclicPaymentFormEdit: string;
    loanForm: string;
    transferForm: string;
    preferencesSettingsForm: string;
}

interface MenuPriorityPreferenceData {
    pagesToHighlight: string[];
}

export interface Preferences {
    shortcutPreference: string[];
    quickIconsPreference: string;
    autoRedirectPreference: AutoRedirectPreferenceData;
    menuPriorityPreference: MenuPriorityPreferenceData;
}

export interface BackendPreferences {
    user_id: string;
    preferences: Preferences;
};

export const mapBackendPreferencesToUserPreferences = (preferencesBackendData: BackendPreferences): Preferences => {
    return {
        shortcutPreference: preferencesBackendData.preferences.shortcutPreference,
        quickIconsPreference: preferencesBackendData.preferences.quickIconsPreference,
        autoRedirectPreference: preferencesBackendData.preferences.autoRedirectPreference,
        menuPriorityPreference: preferencesBackendData.preferences.menuPriorityPreference
    };
};