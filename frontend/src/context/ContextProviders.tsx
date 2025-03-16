import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { UserIconProvider } from './UserIconContext';
import { TransferProvider } from './TransferContext';
import { CyclicPaymentProvider } from './CyclicPaymentContext';
import { AccountProvider } from './AccountContext';
import { CardProvider } from './CardContext';
import { PreferencesProvider } from '../event/context/PreferencesContext';

// eslint-disable-next-line react/prop-types
const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <UserProvider>
        <AuthProvider>
            <UserIconProvider>
                <TransferProvider>
                    <CyclicPaymentProvider>
                        <AccountProvider>
                            <CardProvider>
                                <PreferencesProvider>
                                    {children}
                                </PreferencesProvider>
                            </CardProvider>
                        </AccountProvider>
                    </CyclicPaymentProvider>
                </TransferProvider>
            </UserIconProvider>
        </AuthProvider>
    </UserProvider>
);

export default ContextProviders;
