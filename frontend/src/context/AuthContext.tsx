import { createContext, ReactNode, useMemo, useContext, useCallback } from 'react';
import { UserContext } from './UserContext';
import { mapBackendUserToUser, User } from '../components/utils/User';
import { loginUser, registerUser, logoutUser } from '../services/authService';

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

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setUser, setLoading } = useContext(UserContext);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        await loginUser(email, password);
    }, [setUser]);

    const register = useCallback(async (email: string, password: string): Promise<void> => {
        await registerUser(email, password);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        setLoading(true);

        await logoutUser()
            .then(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setLoading, setUser]);

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
