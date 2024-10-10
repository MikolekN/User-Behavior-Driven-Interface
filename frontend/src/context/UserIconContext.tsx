import React, { createContext, useCallback, useContext, ReactNode, useMemo } from 'react';
import { UserContext } from './UserContext';
import { User } from '../components/utils/User';
import { getUserIcon, uploadUserIcon } from '../services/authService';

interface UserIconContextProps {
    getIcon: () => Promise<void>;
    sendIcon: (icon: File) => Promise<void>;
}

const defaultContextValue: UserIconContextProps = {
    getIcon: async () => {},
    sendIcon: async () => {},
};

export const UserIconContext = createContext<UserIconContextProps>(defaultContextValue);

export const UserIconProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, setUser } = useContext(UserContext);

    const getIcon = useCallback(async (): Promise<void> => {
        if (!user) return;
        try {
            const imageBlob = await getUserIcon();
            const imageFile = new File([imageBlob], 'user-icon.png', { type: imageBlob.type });
            setUser(prevUser => new User({ ...prevUser, icon: imageFile, email: prevUser!.email }));
        } catch (error) {
            console.error('Error fetching icon:', error);
            throw error;
        }
    }, [setUser, user]);

    const sendIcon = useCallback(async (icon: File): Promise<void> => {
        if (!user) return;
        try {
            await uploadUserIcon(icon);
        } catch (error) {
            console.error('Error uploading icon:', error);
            throw error;
        }
    }, [user]);

    const userIconContextValue = useMemo(() => ({ getIcon, sendIcon }), [getIcon, sendIcon]);

    return (
        <UserIconContext.Provider value={userIconContextValue}>
            {children}
        </UserIconContext.Provider>
    );
};
