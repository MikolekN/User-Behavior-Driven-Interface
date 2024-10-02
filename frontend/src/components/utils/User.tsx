export class User {
    login: string;
    email: string;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    role: string;
    icon: File | null;
    
    constructor(login: string, email: string, accountName: string, accountNumber: string, blockades: number, balance: number, currency: string, role: string, icon: File | null = null) {
        this.login = login;
        this.email = email;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.blockades = blockades;
        this.balance = balance;
        this.currency = currency;
        this.role = role;
        this.icon = icon;
    }

    get availableFunds(): string {
        return (this.balance - this.blockades).toFixed(2);
    }
}