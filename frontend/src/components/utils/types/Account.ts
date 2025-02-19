// not finished yet, need to specify all attributes

interface IAccount {
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
    name: string;
    number: string;
    blockades: number;
    balance: number;
    currency: string;
    type: string;
}

export class Account implements IAccount {
    id: string | null;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    accountType: string;

    constructor(account: Partial<IAccount>) {
        this.id = account.id!;
        this.accountName = account.accountName!;
        this.accountNumber = account.accountNumber!;
        this.blockades = account.blockades!;
        this.balance = account.balance!;
        this.currency = account.currency!;
        this.accountType = account.accountType!;
    }

    get availableFunds(): string {
        return (this.balance - this.blockades).toFixed(2);
    }
}

export const mapBackendAccountToAccount = (backendAccountData: BackendAccount): IAccount => {
    return {
        id: backendAccountData._id,
        accountName: backendAccountData.name,
        accountNumber: backendAccountData.number,
        blockades: backendAccountData.blockades,
        balance: backendAccountData.balance,
        currency: backendAccountData.currency,
        accountType: backendAccountData.type
    }
}

export const mapBackendAccountListToAccounts = (backendAccountsData: BackendAccount[]): IAccount[] => {
    const formattedAccounts: IAccount[] = [];
    backendAccountsData.forEach((backendCyclicPaymentData: BackendAccount) => {
        const cyclicPaymentFrontendData = mapBackendAccountToAccount(backendCyclicPaymentData);
        formattedAccounts.push(cyclicPaymentFrontendData);
    });
    return formattedAccounts;
}
