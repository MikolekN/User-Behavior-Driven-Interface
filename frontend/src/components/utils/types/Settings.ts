interface PreferencesSettings {
    areEventsCollected: boolean;
    isShortcutVisible: boolean;
    isNextStepVisible: boolean;
    isQuickIconsVisible: boolean,
    isMenuPriorityVisible: boolean
}

export interface Settings {
    appSettings: object;
    preferencesSettings: PreferencesSettings;
}

export interface BackendSettings {
    settings: Settings;
}

export const mapBackendSettingsToSettings = (settingsBackendData: BackendSettings): Settings => {
    return {
        appSettings: settingsBackendData.settings.appSettings,
        preferencesSettings: settingsBackendData.settings.preferencesSettings
    }
};