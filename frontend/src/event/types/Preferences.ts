interface AutoRedirectPreferenceData {
    accountForm: string;
    accountFormEdit: string;
    cardForm: string;
    cardFormEdit: string;
    cyclicPaymentForm: string;
    cyclicPaymentFormEdit: string;
    loanForm: string;
    transferForm: string;
}

export interface Preferences {
    pageTransitionPreference: string[];
    quickIconsPreference: string;
    autoRedirectPreference: AutoRedirectPreferenceData;
}


export interface BackendPreferences {
    user_id: string;
    preferences: Preferences;
};

export const mapBackendPreferencesToUserPreferences = (preferencesBackendData: BackendPreferences): Preferences => {
    return {
        pageTransitionPreference: preferencesBackendData.preferences.pageTransitionPreference,
        quickIconsPreference: preferencesBackendData.preferences.quickIconsPreference,
        autoRedirectPreference: preferencesBackendData.preferences.autoRedirectPreference
    };
};