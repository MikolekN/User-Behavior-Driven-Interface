import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';

const TransactionsYearlyAnalysis = () => {
    const { user } = useContext(UserContext);
    const { chartData, fetchTransfersAnalysis } = useContext(TransferContext);
    const [ loading, setLoading ] = useState(true);
    const { apiError, handleError } = useApiErrorHandler();

    useEffect(() => {
        if (!user) return;

        const fetchChartData = async () => {
            try {
                const requestBody = {
                    startYear: new Date().getUTCFullYear() - 2,
                    endYear: new Date().getUTCFullYear() + 2
                };
                const interval = 'yearly';
                await fetchTransfersAnalysis(interval, requestBody);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchChartData();
    }, [user, fetchTransfersAnalysis]);

    if (loading) return <div>Loading...</div>;
    
    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title="Transactions yearly analysis"
                alertTitle="No transactions history to generate analysis yet"
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transactions yearly analysis" className="w-4/5">
                <TransfersAnalysisChart chartData={chartData} />
            </Tile>
        </div>
    );
};

export default TransactionsYearlyAnalysis;