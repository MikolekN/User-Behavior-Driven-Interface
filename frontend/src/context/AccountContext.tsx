import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { Account } from '../components/utils/types/Account';

interface AccountContextProps {
    accounts: Account[] | null;
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    getAccounts: () => Promise<void>;
    createAccount: (requestBody: object) => Promise<void>;
    updateAccount: (id: string, requestBody: object) => Promise<void>;
}

const defaultContextValue: AccountContextProps = {
    accounts: null,
    setAccounts: () => {},
    getAccounts: async () => {},
    createAccount: async () => {},
    updateAccount: async () => {}
}

export const AccountContext = createContext<AccountContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const getAccounts = useCallback(async (): Promise<void> => {
        const mockAccounts: Account[] = [
            { id: '1', name: 'Savings Account', number: '12345678', ownerId: 'owner1', availableFunds: 123, balance: 444, iban: 'iban', openDate: new Date() },
            { id: '2', name: 'Checking Account', number: '87654321', ownerId: 'owner2', availableFunds: 12.5, balance: 444, iban: 'iban', openDate: new Date() },
            { id: '3', name: 'Business Account', number: '11223344', ownerId: 'owner3', availableFunds: 30.99, balance: 444, iban: 'iban', openDate: new Date() },
        ];
        setAccounts(mockAccounts);
    }, []);

    const createAccount = useCallback(async (requestBody: object): Promise<void> => {
        console.log("create Account");
    }, []);

    const updateAccount = useCallback(async (id: string, requestBody: object): Promise<void> => {
        console.log("update Account");
    }, []);

    const AccountContextValue = useMemo(() => ({
        accounts, setAccounts, getAccounts, createAccount, updateAccount
    }), [accounts, setAccounts, getAccounts, createAccount, updateAccount]);
    
    return (
        <AccountContext.Provider value={AccountContextValue}>
            {children}
        </AccountContext.Provider>
    );
}