interface NextStepPreferenceObject {
    url: string;
}

export interface BackendNextStepPreference {
    nextStepPreference: NextStepPreferenceObject;
};

export interface NextStepPreference {
    nextStepPreference: NextStepPreferenceObject;
};

export const mapBackendPreferencesToQuickIconsPreferences = (preferencesBackendData: BackendNextStepPreference): NextStepPreference => {
    return {
        nextStepPreference: preferencesBackendData.nextStepPreference
    };
};
