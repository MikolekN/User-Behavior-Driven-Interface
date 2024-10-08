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

    constructor(user: IUser);
    constructor(login: string, email: string, accountName: string, accountNumber: string, blockades: number, balance: number, currency: string, role: string, icon?: File | null);
    constructor(arg1: IUser | string, email?: string, accountName?: string, accountNumber?: string, blockades?: number, balance?: number, currency?: string, role?: string, icon: File | null = null) {
        if (typeof arg1 === 'string') {
            this.login = arg1;
            this.email = email!;
            this.accountName = accountName!;
            this.accountNumber = accountNumber!;
            this.blockades = blockades!;
            this.balance = balance!;
            this.currency = currency!;
            this.role = role!;
            this.icon = icon;
        } else {
            this.login = arg1.login;
            this.email = arg1.email;
            this.accountName = arg1.accountName;
            this.accountNumber = arg1.accountNumber;
            this.blockades = arg1.blockades;
            this.balance = arg1.balance;
            this.currency = arg1.currency;
            this.role = arg1.role;
            this.icon = arg1.icon;
        }
    }

    get availableFunds(): string {
        return (this.balance - this.blockades).toFixed(2);
    }
}
