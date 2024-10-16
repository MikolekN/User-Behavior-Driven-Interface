import { createContext, ReactNode, useMemo, useCallback, useState } from 'react';
import { createLoanData, createTransferData, fetchTransfersAnalysisData, fetchTransfersData } from '../services/transferService';
import { ChartData } from '../components/utils/types/TransfersAnalysisChartTypes';
import { TransactionsHistoryType } from '../components/utils/types/TransfersTypes';

interface TransferContextProps {
    chartData: ChartData[] | null;
    setChartData: React.Dispatch<React.SetStateAction<ChartData[]>>;
    transfers: TransactionsHistoryType[] | null;
    setTransfers: React.Dispatch<React.SetStateAction<TransactionsHistoryType[]>>;
    fetchTransfersAnalysis: (interval: string, requestBody: object) => Promise<void>;
    fetchTransfers: () => Promise<void>;
    createTransfer: (requestBody: object) => Promise<void>;
    createLoan: (requestBody: object) => Promise<void>;
}

const defaultContextValue: TransferContextProps = {
    chartData: null,
    setChartData: () => {},
    transfers: null,
    setTransfers: () => {},
    fetchTransfersAnalysis: async () => {},
    fetchTransfers: async () => {},
    createTransfer: async () => {},
    createLoan: async () => {}
};

export const TransferContext = createContext<TransferContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const TransferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [transfers, setTransfers] = useState<TransactionsHistoryType[]>([]);

    const fetchTransfersAnalysis = useCallback(async (interval: string, requestBody: object): Promise<void> => {
        try {
            const { transfers: chartData } = await fetchTransfersAnalysisData(interval, requestBody);
            setChartData(chartData);
        } catch (error) {
            console.error('Error during fetch Transfers Analysis Yearly:', error);
            throw error;
        }
    }, []);

    const fetchTransfers = useCallback(async (): Promise<void> => {
        try {
            const { transfers: transfersData } = await fetchTransfersData();
            setTransfers(transfersData);
        } catch (error) {
            console.error('Error during fetch Transfers:', error);
            throw error;
        }
    }, []);

    const createTransfer = useCallback(async (requestBody: object): Promise<void> => {
        try {
            await createTransferData(requestBody);
        } catch (error) {
            console.error('Error during create Transfer:', error);
            throw error;
        }
    }, []);

    const createLoan = useCallback(async (requestBody: object): Promise<void> => {
        try {
            await createLoanData(requestBody);
        } catch (error) {
            console.error('Error during create Transfer:', error);
            throw error;
        }
    }, []);

    const TransferContextValue = useMemo(() => ({
        chartData,
        setChartData,
        transfers,
        setTransfers,
        fetchTransfersAnalysis,
        fetchTransfers,
        createTransfer,
        createLoan
    }), [chartData, setChartData, transfers, setTransfers, 
        fetchTransfersAnalysis, fetchTransfers,
        createTransfer, createLoan]);

    return (
        <TransferContext.Provider value={TransferContextValue}>
            {children}
        </TransferContext.Provider>
    );
};
