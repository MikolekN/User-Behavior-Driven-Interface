import React, { createContext, ReactNode, useCallback, useMemo, useState } from "react";
import { getQuickIconsPreferencesFromUserPreferences, QuickIconsPreference } from "../types/QuickIconsPreference";
import { generateUserPreferencesData, getUserPreferencesData } from "../service/eventService";
import { User } from "../../components/utils/User";
import { getShortcutPreferencesFromUserPreferences, ShortcutPreference } from "../types/ShortcutPreference";
import { mapBackendPreferencesToUserPreferences, Preferences } from "../types/Preferences";


interface PreferencesContextProps {
    userPreferences: Preferences | null;
    setUserPreferences: React.Dispatch<React.SetStateAction<Preferences | null>>;
    quickIconsPreference: QuickIconsPreference | null;
    setQuickIconsPreference: React.Dispatch<React.SetStateAction<QuickIconsPreference | null>>;
    shortcutPreference: ShortcutPreference | null;
    setShortcutPreference: React.Dispatch<React.SetStateAction<ShortcutPreference | null>>;
    getQuickIconsPreference: () => void;
    getShortcutPreference: () => void;
    getUserPreference: (user: User) => Promise<void>;
    generateUserPreference: (user: User) => Promise<void>;
}

const defaultContextValue: PreferencesContextProps = {
    userPreferences: null,
    setUserPreferences: () => {},
    quickIconsPreference: null,
    setQuickIconsPreference: () => {},
    shortcutPreference: null,
    setShortcutPreference: () => {},
    getQuickIconsPreference: () => {},
    getShortcutPreference: () => {},
    getUserPreference: async () => {},
    generateUserPreference: async () => {},
}

export const PreferencesContext = createContext<PreferencesContextProps>(defaultContextValue);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userPreferences, setUserPreferences] = useState<Preferences | null>(null);
    const [quickIconsPreference, setQuickIconsPreference] = useState<QuickIconsPreference | null>(null);
    const [shortcutPreference, setShortcutPreference] = useState<ShortcutPreference | null>(null);

    const getQuickIconsPreference = useCallback((): void => {
        if (userPreferences) {
            const quickIconsPreferencesData: QuickIconsPreference = getQuickIconsPreferencesFromUserPreferences(userPreferences);
            setQuickIconsPreference(quickIconsPreferencesData);
        }
    }, [userPreferences]);

    const getShortcutPreference = useCallback((): void => {
        if (userPreferences) {
            const shortcutPreferencesData: ShortcutPreference = getShortcutPreferencesFromUserPreferences(userPreferences);
            setShortcutPreference(shortcutPreferencesData);
        }
    }, [userPreferences]);

    const getUserPreference = useCallback(async (user: User): Promise<void> => {
        const {preferences: generatedPreferencesBackendData} = await getUserPreferencesData(user);
        if (generatedPreferencesBackendData) {
            const frontendQuickIconsPreferencesData: Preferences = mapBackendPreferencesToUserPreferences(generatedPreferencesBackendData);
            setUserPreferences(frontendQuickIconsPreferencesData);
        }
    }, []);

    const generateUserPreference = useCallback(async (user: User): Promise<void> => {
        const {preferences: generatedPreferencesBackendData} = await generateUserPreferencesData(user);
        if (generatedPreferencesBackendData) {
            const frontendQuickIconsPreferencesData: Preferences = mapBackendPreferencesToUserPreferences(generatedPreferencesBackendData);
            setUserPreferences(frontendQuickIconsPreferencesData);
        }
    }, []);

    const PreferencesContextValue = useMemo(() => ({
        userPreferences, setUserPreferences, quickIconsPreference, setQuickIconsPreference, shortcutPreference, setShortcutPreference, 
        getQuickIconsPreference, getShortcutPreference, getUserPreference, generateUserPreference
    }), [userPreferences, setUserPreferences, quickIconsPreference, setQuickIconsPreference, shortcutPreference, setShortcutPreference, 
        getQuickIconsPreference, getShortcutPreference, getUserPreference, generateUserPreference]);

    return (
        <PreferencesContext.Provider value={PreferencesContextValue}>
            {children}
        </PreferencesContext.Provider>
    );
}
