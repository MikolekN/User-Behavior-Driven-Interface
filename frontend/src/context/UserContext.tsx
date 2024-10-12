import React, { createContext, useCallback, useState, useEffect, ReactNode, useMemo } from 'react';
import { mapBackendUserToUser, User } from '../components/utils/User';
import { getUserData, updateUserField, updateUserPassword } from '../services/authService';

interface UserContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    getUser: () => Promise<void>;
    updateUser: (field: string, value: string) => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const defaultContextValue: UserContextProps = {
    user: null,
    setUser: () => {},
    setLoading: () => {},
    getUser: async () => {},
    updateUser: async () => {},
    updatePassword: async () => {},
};

export const UserContext = createContext<UserContextProps>(defaultContextValue);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getUser = useCallback(async (): Promise<void> => {
        const { user: userBackendData } = await getUserData();
        if (userBackendData) {
            const userFrontendData = mapBackendUserToUser(userBackendData);
            setUser(prevUser => new User({ ...userFrontendData, icon: prevUser?.icon || null, email: userFrontendData.email! }));
        }
    }, []);

    const updateUser = useCallback(async (field: string, value: string): Promise<void> => {
        if (!user) return;
        const { user: userBackendData } = await updateUserField(field, value);
        if (userBackendData) {
            const userFrontendData = mapBackendUserToUser(userBackendData);
            setUser(prevUser => new User({ ...userFrontendData, icon: prevUser?.icon || null, email: userFrontendData.email! }));
        }
    }, [user]);

    const updatePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
        if (!user) return;
        await updateUserPassword(currentPassword, newPassword);
    }, [user]);

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            if (!user && !loading) {
                await getUser();
            }
        };
        void fetchUser();
    }, [getUser, loading, user]);

    const userContextValue = useMemo(() => ({
        user,
        setUser,
        setLoading,
        getUser,
        updateUser,
        updatePassword
    }), [getUser, updateUser, updatePassword, user]);

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
};
