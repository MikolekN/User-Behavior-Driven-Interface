// not finished yet, need to specify all attributes

export interface Account {
    id: string | null;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    accountType: string;
}

export interface BackendAccount {
    _id: string | null;
    account_name: string;
    account_number: string;
    blockades: number;
    balance: number;
    currency: string;
    account_type: string;
}

export const mapBackendAccountToAccount = (backendAccountData: BackendAccount): Account => {
    return {
        id: backendAccountData._id,
        accountName: backendAccountData.account_name,
        accountNumber: backendAccountData.account_number,
        blockades: backendAccountData.blockades,
        balance: backendAccountData.balance,
        currency: backendAccountData.currency,
        accountType: backendAccountData.account_type
    }
}

export const mapBackendAccountListToAccounts = (backendAccountsData: BackendAccount[]): Account[] => {
    const formattedAccounts: Account[] = [];
    backendAccountsData.forEach((backendCyclicPaymentData: BackendAccount) => {
        const cyclicPaymentFrontendData = mapBackendAccountToAccount(backendCyclicPaymentData);
        formattedAccounts.push(cyclicPaymentFrontendData);
    });
    return formattedAccounts;
}
