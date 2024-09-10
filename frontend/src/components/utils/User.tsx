export class User {
    login: string;
    accountName: string;
    accountNumber: string;
    blockades: number;
    balance: number;
    currency: string;
    
    constructor(login: string, accountName: string, accountNumber: string, blockades: number, balance: number, currency: string) {
        this.login = login;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.blockades = blockades;
        this.balance = balance;
        this.currency = currency;
    }

    get availableFunds(): string {
        return (this.balance - this.blockades).toFixed(2);
    }
}