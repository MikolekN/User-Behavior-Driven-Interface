import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { mapBackendUserToUser, User } from '../components/utils/User';
import {
    getUserData,
    loginUser,
    registerUser,
    logoutUser,
    getUserIcon,
    uploadUserIcon,
    updateUserField,
    updateUserPassword
} from '../services/authService';

interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    getUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getIcon: () => Promise<void>;
    sendIcon: (icon: File) => Promise<void>;
    updateUser: (field: string, value: string) => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const defaultContextValue: AuthContextProps = {
    user: null,
    setUser: () => {},
    getUser: async () => {},
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    getIcon: async () => {},
    sendIcon: async () => {},
    updateUser: async () => {},
    updatePassword: async () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getUser = useCallback(async (): Promise<void> => {
        try {
            const { user: userBackendData } = await getUserData();
            if (userBackendData) {
                const userFrontendData = mapBackendUserToUser(userBackendData);
                setUser(prevUser => new User({ ...userFrontendData, icon: prevUser?.icon || null, email: userFrontendData.email! }));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const { user: userBackendData } = await loginUser(email, password);
            if (userBackendData) {
                const userFrontendData = mapBackendUserToUser(userBackendData);
                setUser(prevUser => new User({ ...userFrontendData, icon: prevUser?.icon || null, email: userFrontendData.email! }));
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }, []);

    const register = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            await registerUser(email, password);
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const getIcon = useCallback(async (): Promise<void> => {
        if (!user) return;
        try {
            const imageBlob = await getUserIcon();
            const imageFile = new File([imageBlob], 'user-icon.png', { type: imageBlob.type });
            // user.icon = imageFile;
            // resetting a user works with useEffect because React uses shallow comparison (React compares the memory reference of objects, not their internal properties)
            setUser(prevUser => {
                if (!prevUser) return null;
                return new User({ ...prevUser, icon: imageFile });
            });            
        } catch (error) {
            console.error('Error fetching icon:', error);
            throw error;
        }
    }, [user]);

    const sendIcon = useCallback(async (icon: File): Promise<void> => {
        if (!user) return;
        try {
            await uploadUserIcon(icon);
        } catch (error) {
            console.error('Error uploading icon:', error);
            throw error;
        }
    }, [user]);

    const updateUser = useCallback(async (field: string, value: string): Promise<void> => {
        if (!user) return;
        try {
            const { user: userBackendData } = await updateUserField(field, value);
            if (userBackendData) {
                const userFrontendData = mapBackendUserToUser(userBackendData);
                setUser(prevUser => new User({ ...userFrontendData, icon: prevUser?.icon || null, email: userFrontendData.email! }));
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }, [user]);

    const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
        if (!user) return;
        try {
            await updateUserPassword(currentPassword, newPassword);
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }, [user]);

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            if (!user && !loading) {
                try {
                    await getUser();
                } catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        };
        void fetchUser();
    }, [getUser, user, loading]);

    const authContextValue = useMemo(() => ({
        user,
        setUser,
        getUser,
        login,
        register,
        logout,
        getIcon,
        sendIcon,
        updateUser,
        updatePassword
    }), [getIcon, getUser, login, logout, register, sendIcon, updatePassword, updateUser, user]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
