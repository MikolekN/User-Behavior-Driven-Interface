import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/utils/User';

interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    fetchUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const defaultContextValue: AuthContextProps = {
    user: null,
    setUser: () => {},
    fetchUser: async () => {},
    login: async () => {},
    register: async () => {},
    logout: async () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultContextValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = async () => {
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
                        data.user.account_name,
                        data.user.account_number,
                        data.user.blockades.toFixed(2),
                        data.user.balance.toFixed(2),
                        data.user.currency
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
                body: JSON.stringify({ login: email, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUser(new User(
                    data.user.login,
                    data.user.account_name,
                    data.user.account_number,
                    data.user.blockades.toFixed(2),
                    data.user.balance.toFixed(2),
                    data.user.currency
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

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
