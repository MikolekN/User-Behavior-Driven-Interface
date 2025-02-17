import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import ChartLoadingSkeleton from '../Loading/ChartLoadingSkeleton';

const TransactionsMonthlyAnalysis = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { chartData, fetchTransfersAnalysis } = useContext(TransferContext);
    const [ loading, setLoading ] = useState(true);
    const { apiError, handleError } = useApiErrorHandler();
    
    useEffect(() => {
        if (!user) return;

        const fetchChartData = async () => {
            try {
                const requestBody = {
                    year: (new Date().getUTCFullYear()).toString()
                };
                const interval = 'monthly';
                await fetchTransfersAnalysis(interval, requestBody);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchChartData();
    }, [user, fetchTransfersAnalysis]);
    
    if (loading) return <ChartLoadingSkeleton />;

    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title={t('transactionsMonthlyAnalysis.tile.title')}
                alertTitle={t('transactionsMonthlyAnalysis.emptyAlertInfo')}
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Tile title={t('transactionsMonthlyAnalysis.tile.title')} className="w-4/5">
                <TransfersAnalysisChart chartData={chartData} truncateText={true}/>
            </Tile>
        </div>

    );
};

export default TransactionsMonthlyAnalysis;