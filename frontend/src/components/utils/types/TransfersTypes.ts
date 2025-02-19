import { t } from "i18next";
import { ChartData } from "./TransfersAnalysisChartTypes";
import i18n from "../../../i18n";

export interface TransactionsHistoryType {
    date: string;
    transactions: Transaction[];
}

export interface BackendTransaction {
    _id: string;
    amount: number;
    created: string;
    is_deleted: boolean;
    is_income: boolean;
    issuer_name: string;
    title: string;
    recipient_account_number: string;
    sender_account_number: string;
}

export interface BackendTransactionsHistoryData {
    date: string;
    transactions: BackendTransaction[]
}

export interface Transaction {
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
        issuerName: backendTransfersData.issuer_name,
        title: backendTransfersData.title,
        amount: backendTransfersData.amount,
        income: backendTransfersData.is_income
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
            interval: i18n.exists(`chart.months.${chartData.interval}`)
                    ? t(`chart.months.${chartData.interval}`)
                    : chartData.interval
        }
        formattedAnalysisChartData.push(formattedChartData);
    });
    return formattedAnalysisChartData;
}
