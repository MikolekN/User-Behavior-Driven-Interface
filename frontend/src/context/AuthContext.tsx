import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/utils/User';

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
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const getUser = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUser(new User(
                        data.user.login,
                        data.user.email,
                        data.user.account_name,
                        data.user.account_number,
                        data.user.blockades.toFixed(2),
                        data.user.balance.toFixed(2),
                        data.user.currency,
                        data.user.role
                    ));
                }
            } else {
                console.error('Failed to fetch current user:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUser(new User(
                    data.user.login,
                    data.user.email,
                    data.user.account_name,
                    data.user.account_number,
                    data.user.blockades.toFixed(2),
                    data.user.balance.toFixed(2),
                    data.user.currency,
                    data.user.role
                ));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login: email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    };

    // TODO: better handle errors
    // Add return types to functions

    const logout = async () => {
        try {
            setUser(null);
            const response = await fetch('http://127.0.0.1:5000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Failed to logout:', response.status);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getIcon = async () => {
        if (!user) {
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/icon', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                const data = await response.json();
                console.error(data.message, response.status);
                return;
            }
            const imageBlob = await response.blob()
            const imageFile = new File([imageBlob], "user-icon.png", { type: imageBlob.type });
            user.icon = imageFile;
        } catch (error) {
            console.error('Error getting icon:', error);
        }
    }

    const sendIcon = async (icon: File) => {
        if (!user) {
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/icon', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "image/png"
                },
                body: icon
            });
            if (!response.ok) {
                const data = await response.json();
                console.error(data.message, response.status);
                return;
            }
            const imageBlob = await response.blob()
            const imageFile = new File([imageBlob], "user-icon.png", { type: imageBlob.type });
            user.icon = imageFile;
        } catch (error) {
            console.error('Error sending icon:', error);
        }
    }

    const updateUser = async (field: string, value: string) => {
        if (!user) {
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/api/user/update', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value })
            });
            if (!response.ok) {
                const data = await response.json();
                console.error(data.message, response.status);
                return;
            }
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUser(new User(
                        data.user.login,
                        data.user.email,
                        data.user.account_name,
                        data.user.account_number,
                        data.user.blockades.toFixed(2),
                        data.user.balance.toFixed(2),
                        data.user.currency,
                        data.user.role
                    ));
                }
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                try {
                    await getUser();
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchUser();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, getUser, login, register, logout, getIcon, sendIcon, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
