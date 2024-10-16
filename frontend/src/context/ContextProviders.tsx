import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { UserIconProvider } from './UserIconContext';
import { TransferProvider } from './TransferContext';

// eslint-disable-next-line react/prop-types
const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <UserProvider>
        <AuthProvider>
            <UserIconProvider>
                <TransferProvider>
                    {children}
                </TransferProvider>
            </UserIconProvider>
        </AuthProvider>
    </UserProvider>
);

export default ContextProviders;
