import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { UserIconProvider } from './UserIconContext';
import { TransferProvider } from './TransferContext';
import { CyclicPaymentProvider } from './CyclicPaymentContext';
import { AccountProvider } from './AccountContext';
import { CardProvider } from './CardContext';

// eslint-disable-next-line react/prop-types
const ContextProviders: React.FC<{ children: ReactNode }> = ({ children }) => (
    <UserProvider>
        <AuthProvider>
            <UserIconProvider>
                <TransferProvider>
                    <CyclicPaymentProvider>
                        <AccountProvider>
                            <CardProvider>
                                {children}
                            </CardProvider>
                        </AccountProvider>
                    </CyclicPaymentProvider>
                </TransferProvider>
            </UserIconProvider>
        </AuthProvider>
    </UserProvider>
);

export default ContextProviders;
