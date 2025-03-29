import { createContext, ReactNode, useMemo, useContext, useCallback } from 'react';
import { UserContext } from './UserContext';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { AccountContext } from './AccountContext';
import { PreferencesContext } from '../event/context/PreferencesContext';

interface AuthContextProps {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const defaultContextValue: AuthContextProps = {
    login: async () => {},
    register: async () => {},
    logout: async () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setUser, setLoading, getUser } = useContext(UserContext);
    const { setAccount } = useContext(AccountContext);
    const { setUserPreferences, generateUserPreference, getUserPreference, setShortcutPreference } = useContext(PreferencesContext);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        setLoading(true);
        await loginUser(email, password);
        const userData = await getUser();
        if (!userData) return;
        try {
            await generateUserPreference(userData);
            await getUserPreference(userData);
        } catch (error) {
            setUserPreferences(null);
            setShortcutPreference(null);
        }
        
        setLoading(false);
    }, [setLoading, setUser]);

    const register = useCallback(async (email: string, password: string): Promise<void> => {
        await registerUser(email, password);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        setLoading(true);

        await logoutUser();
        setAccount(null);
        setUser(null);

        setLoading(false);
        setUserPreferences(null);
        
    }, [setLoading, setUser, setAccount, setUserPreferences]);

    const authContextValue = useMemo(() => ({
        login,
        register,
        logout
    }), [login, logout, register]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
