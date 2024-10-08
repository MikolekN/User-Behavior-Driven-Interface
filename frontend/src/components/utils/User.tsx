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
