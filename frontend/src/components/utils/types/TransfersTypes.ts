import { ChartData } from "./TransfersAnalysisChartTypes";

export interface TransactionsHistoryType {
    date: string;
    transactions: Transaction[];
}

export interface BackendTransaction {
    _id: string;
    amount: number;
    created: string;
    income: boolean;
    issuer_name: string;
    title: string;
    transfer_from_id: string;
    transfer_to_id: string;
}

export interface BackendTransactionsHistoryData {
    date: string;
    transactions: BackendTransaction[]
}

export interface Transaction {
    created: string;
    issuerName: string;
    title: string;
    amount: number;
    income: boolean;
}

interface BackendChartData {
    interval: string;
    income: number;
    outcome: number;
}



export const mapBackendTransfersDataToTransfers = (backendTransfersData: BackendTransaction): Transaction => {
    return {
        created: backendTransfersData.created,
        issuerName: backendTransfersData.issuer_name,
        title: backendTransfersData.title,
        amount: backendTransfersData.amount,
        income: backendTransfersData.income
    };
};

export const mapBackendTransfersListDataToTransfers = (transfersBackendData: BackendTransactionsHistoryData[]): TransactionsHistoryType[] => {
    const formattedTransfers: TransactionsHistoryType[] = [];
    transfersBackendData.forEach((transfer) => {
        const transactions: Transaction[] = [];
        transfer.transactions.forEach((transaction) => {
            const transactionFrontendData = mapBackendTransfersDataToTransfers(transaction);
            transactions.push(transactionFrontendData);
        }); 
        const formattedTransfer: TransactionsHistoryType = {
            date: transfer.date,
            transactions: transactions
        } 
        formattedTransfers.push(formattedTransfer);
    });
    return formattedTransfers;
}

export const mapBackendChartDataToChartData = (chartBackendData: BackendChartData[]): ChartData[] => {
    const formattedAnalysisChartData: ChartData[] = [];
    chartBackendData.forEach((chartData) => {
        const formattedChartData: ChartData = {
            income: chartData.income,
            outcome: chartData.outcome,
            interval: chartData.interval
        } 
        formattedAnalysisChartData.push(formattedChartData);
    });
    return formattedAnalysisChartData;
}