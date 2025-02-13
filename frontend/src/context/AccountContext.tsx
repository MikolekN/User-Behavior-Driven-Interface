import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { Account, mapBackendAccountToAccount, mapBackendAccountListToAccounts } from '../components/utils/types/Account';
import { createAccountData, deleteAccountData, getAccountData, getAccountsData, getActiveAccountData, setActiveAccountData, updateAccountData } from '../services/accountService';

interface AccountContextProps {
    account: Account | null;
    setAccount:  React.Dispatch<React.SetStateAction<Account | null>>;
    accounts: Account[] | null;
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    getAccount: (accountNumber: string) => Promise<void>;
    getAccounts: () => Promise<void>;
    createAccount: (requestBody: object) => Promise<void>;
    updateAccount: (accountNumber: string, requestBody: object) => Promise<void>;
    deleteAccount: (accountNumber: string) => Promise<void>;
    getActiveAccount: () => Promise<void>;
    setActiveAccount: (accountNumber: string) => Promise<void>;
}

const defaultContextValue: AccountContextProps = {
    account: null,
    setAccount: () => {},
    accounts: null,
    setAccounts: () => {},
    getAccount: async () => {},
    getAccounts: async () => {},
    createAccount: async () => {},
    updateAccount: async () => {},
    deleteAccount: async () => {},
    getActiveAccount: async () => {},
    setActiveAccount: async () => {}
}

export const AccountContext = createContext<AccountContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<Account | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const getAccount = useCallback(async (accountNumber: string): Promise<void> => {
        const {account: accountBackendData} = await getAccountData(accountNumber);
        if (accountBackendData) {
            setAccount(mapBackendAccountToAccount(accountBackendData));
        }
    }, []);

    const getAccounts = useCallback(async (): Promise<void> => {
        const { accounts: accountsBackendData } = await getAccountsData();
        if (accountsBackendData) {
            setAccounts(mapBackendAccountListToAccounts(accountsBackendData));
        }
    }, []);

    const createAccount = useCallback(async (requestBody: object): Promise<void> => {
        await createAccountData(requestBody);
    }, []);

    const updateAccount = useCallback(async (accountNumber: string, requestBody: object): Promise<void> => {
        await updateAccountData(accountNumber,  requestBody);
    }, []);

    const deleteAccount = useCallback(async (accountNumber: string): Promise<void> => {
        await deleteAccountData(accountNumber);
    }, []);

    const getActiveAccount = useCallback(async (): Promise<void> => {
        const {account: accountBackendData} = await getActiveAccountData();
        if (accountBackendData) {
            setAccount(mapBackendAccountToAccount(accountBackendData));
        }
    }, []);

    const setActiveAccount = useCallback(async (accountNumber: string): Promise<void> => {
        await setActiveAccountData(accountNumber);
    }, []);

    const AccountContextValue = useMemo(() => ({
        account, setAccount, accounts, setAccounts, getAccount, getAccounts, createAccount, updateAccount, deleteAccount, getActiveAccount, setActiveAccount
    }), [account, setAccount, accounts, setAccounts, getAccount, getAccounts, createAccount, updateAccount, deleteAccount, getActiveAccount, setActiveAccount]);
    
    return (
        <AccountContext.Provider value={AccountContextValue}>
            {children}
        </AccountContext.Provider>
    );
}