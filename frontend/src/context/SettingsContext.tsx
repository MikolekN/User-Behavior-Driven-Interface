import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { mapBackendSettingsToSettings, Settings } from "../components/utils/types/Settings";
import { getSettingsData, updateSettingsData } from "../services/settingsService";
import { User } from "../components/utils/User";
import { UserContext } from "./UserContext";



interface SettingsContextProps {
    settings: Settings | null;
    setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;
    getSettings: (user: User) => Promise<void>;
    updateSettings: (user: User, requestBody: object) => Promise<void>;
}

const defaultContextValue: SettingsContextProps = {
    settings: null,
    setSettings: () => {},
    getSettings: async () => {},
    updateSettings: async () => {}
};

export const SettingsContext = createContext<SettingsContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useContext(UserContext);
    const [settings, setSettings] = useState<Settings | null>(null);

    const getSettings = useCallback(async (user: User): Promise<void> => {
        const { settings: backendSettingsData } = await getSettingsData(user);
        if (backendSettingsData) {
            const frontendSettingsData: Settings = mapBackendSettingsToSettings(backendSettingsData);
            setSettings(frontendSettingsData);
        }
    }, []);

    const updateSettings = useCallback(async (user: User, requestBody: object): Promise<void> => {
        await updateSettingsData(user, requestBody);
    }, []);

    useEffect(() => {
        const fetchUserSettings = async (): Promise<void> => {
            if (!settings) {
                await getSettings(user!);
            }
        };
        void fetchUserSettings();
    }, [getSettings, settings]);

    const SettingsContextValue = useMemo(() => ({
        settings,
        setSettings,
        getSettings,
        updateSettings
    }), [settings, setSettings, getSettings,
        updateSettings]);

    return (
        <SettingsContext.Provider value={SettingsContextValue}>
            {children}
        </SettingsContext.Provider>
    );
};