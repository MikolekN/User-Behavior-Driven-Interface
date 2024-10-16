export interface TransactionsHistoryType {
    date: string;
    transactions: Transaction[];
}

export interface Transaction {
    created: string;
    issuer_name: string;
    title: string;
    amount: number;
    income: boolean;
}