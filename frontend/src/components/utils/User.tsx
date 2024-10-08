interface IUser {
    login: string;
    email: string;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    role: string;
    icon: File | null;
}

interface IBackendUser {
    login: string;
    email: string;
    account_name: string;
    account_number: string;
    blockades: number;
    balance: number;
    currency: string;
    role: string;
    icon?: File | null;
}

export const mapBackendUserToUser = (backendUser: IBackendUser): Partial<IUser> => {
    return {
        login: backendUser.login,
        email: backendUser.email,
        accountName: backendUser.account_name,
        accountNumber: backendUser.account_number,
        blockades: backendUser.blockades,
        balance: backendUser.balance,
        currency: backendUser.currency,
        role: backendUser.role || "USER",
        icon: null
    };
};

export class User implements IUser {
    login: string;
    email: string;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    role: string;
    icon: File | null;

    constructor(user: Partial<IUser> & { email: string }) {
        this.login = user.login ?? user.email;
        this.email = user.email;
        this.accountName = user.accountName ?? "Przykładowa nazwa konta";
        this.accountNumber = user.accountNumber ?? "";
        this.blockades = user.blockades ?? 0;
        this.balance = user.balance ?? 0;
        this.currency = user.currency ?? "PLN";
        this.role = user.role ?? "USER";
        this.icon = user.icon ?? null;
    }

    get availableFunds(): string {
        return (this.balance - this.blockades).toFixed(2);
    }
}
