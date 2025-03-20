import React, { createContext, ReactNode, useCallback, useMemo, useState } from "react";
import { mapBackendPreferencesToQuickIconsPreferences, QuickIconsPreference } from "../types/QuickIconsPreference";
import { generateUserPreferencesData, getUserPreferencesData } from "../service/eventService";
import { User } from "../../components/utils/User";


interface PreferencesContextProps {
    quickIconsPreference: QuickIconsPreference | null;
    setQuickIconsPreference: React.Dispatch<React.SetStateAction<QuickIconsPreference | null>>; 
    getQuickIconsPreference: (user: User) => Promise<void>;
    generateQuickIconsPreference: (user: User) => Promise<void>;
}

const defaultContextValue: PreferencesContextProps = {
    quickIconsPreference: null,
    setQuickIconsPreference: () => {},
    getQuickIconsPreference: async () => {},
    generateQuickIconsPreference: async () => {},
}

export const PreferencesContext = createContext<PreferencesContextProps>(defaultContextValue);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [quickIconsPreference, setQuickIconsPreference] = useState<QuickIconsPreference | null>(null);

    const getQuickIconsPreference = useCallback(async (user: User): Promise<void> => {
        const { preferences: preferencesBackendData} = await getUserPreferencesData(user);
        if (preferencesBackendData) {
            const frontendQuickIconsPreferencesData = mapBackendPreferencesToQuickIconsPreferences(preferencesBackendData);
            setQuickIconsPreference(frontendQuickIconsPreferencesData);
        }
    }, []);

    const generateQuickIconsPreference = useCallback(async (user: User): Promise<void> => {
        const {preferences: generatedPreferencesBackendData} = await generateUserPreferencesData(user);
        if (generatedPreferencesBackendData) {
            const frontendQuickIconsPreferencesData = mapBackendPreferencesToQuickIconsPreferences(generatedPreferencesBackendData);
            setQuickIconsPreference(frontendQuickIconsPreferencesData);
        }
    }, []);

    const PreferencesContextValue = useMemo(() => ({
        quickIconsPreference, setQuickIconsPreference, getQuickIconsPreference, generateQuickIconsPreference
    }), [quickIconsPreference, setQuickIconsPreference, getQuickIconsPreference, generateQuickIconsPreference]);

    return (
        <PreferencesContext.Provider value={PreferencesContextValue}>
            {children}
        </PreferencesContext.Provider>
    );
}
