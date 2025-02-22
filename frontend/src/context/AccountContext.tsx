import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Account, mapBackendAccountToAccount, mapBackendAccountListToAccounts } from '../components/utils/types/Account';
import { createAccountData, deleteAccountData, getAccountData, getAccountsData, getActiveAccountData, setActiveAccountData, updateAccountData } from '../services/accountService';

interface AccountContextProps {
    account: Account | null;
    setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
    activeAccount: Account | null;
    setActiveAccount:  React.Dispatch<React.SetStateAction<Account | null>>;
    accounts: Account[] | null;
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
    getAccount: (accountNumber: string) => Promise<void>;
    getAccounts: () => Promise<void>;
    createAccount: (requestBody: object) => Promise<void>;
    updateAccount: (accountNumber: string, requestBody: object) => Promise<void>;
    deleteAccount: (accountNumber: string) => Promise<void>;
    getActiveAccount: () => Promise<void>;
    fetchActiveAccount: (accountNumber: string) => Promise<void>;
}

const defaultContextValue: AccountContextProps = {
    account: null,
    setAccount: () => {},
    activeAccount: null,
    setActiveAccount: () => {},
    accounts: null,
    setAccounts: () => {},
    getAccount: async () => {},
    getAccounts: async () => {},
    createAccount: async () => {},
    updateAccount: async () => {},
    deleteAccount: async () => {},
    getActiveAccount: async () => {},
    fetchActiveAccount: async () => {}
}

export const AccountContext = createContext<AccountContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<Account | null>(null);
    const [activeAccount, setActiveAccount] = useState<Account | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const getAccount = useCallback(async (accountNumber: string): Promise<void> => {
        const {account: accountBackendData} = await getAccountData(accountNumber);
        if (accountBackendData) {
            const frontendAccountData = mapBackendAccountToAccount(accountBackendData); 
            setAccount(() => new Account({...frontendAccountData}));
        }
    }, []);

    const getAccounts = useCallback(async (): Promise<void> => {
        const { accounts: accountsBackendData } = await getAccountsData();
        if (accountsBackendData) {
            const frontendAccountsData = mapBackendAccountListToAccounts(accountsBackendData); 
            setAccounts(frontendAccountsData.map(accountData => new Account(
                {...accountData}
            )));
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
            const frontendAccountData = mapBackendAccountToAccount(accountBackendData); 
            setActiveAccount(() => new Account({...frontendAccountData}));
        }
    }, []);

    const fetchActiveAccount = useCallback(async (accountNumber: string): Promise<void> => {
        await setActiveAccountData(accountNumber);
    }, []);

    useEffect(() => {
        const fetchAccount = async (): Promise<void> => {
            if (!activeAccount) {
                await getActiveAccount();
            }
        };
        void fetchAccount();
    }, [getActiveAccount, activeAccount]);

    const AccountContextValue = useMemo(() => ({
        account, setAccount, activeAccount, setActiveAccount, accounts, setAccounts, getAccount, getAccounts, createAccount, updateAccount, deleteAccount, getActiveAccount, fetchActiveAccount
    }), [account, setAccount, activeAccount, setActiveAccount, accounts, setAccounts, getAccount, getAccounts, createAccount, updateAccount, deleteAccount, getActiveAccount, fetchActiveAccount]);
    
    return (
        <AccountContext.Provider value={AccountContextValue}>
            {children}
        </AccountContext.Provider>
    );
}