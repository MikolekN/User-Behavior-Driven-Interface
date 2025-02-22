import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import ChartLoadingSkeleton from '../Loading/ChartLoadingSkeleton';

const TransactionsYearlyAnalysis = () => {
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
                    start_year: (new Date().getUTCFullYear() - 2).toString(),
                    end_year: (new Date().getUTCFullYear() + 2).toString()
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

    if (loading) return <ChartLoadingSkeleton />;

    if (apiError.isError) {
        return (
            <EmptyResponseInfoAlert
                title={t('transactionsYearlyAnalysis.tile.title')}
                alertTitle={t('transactionsYearlyAnalysis.emptyAlertInfo')}
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (
        <Tile title={t('transactionsYearlyAnalysis.tile.title')}>
            <TransfersAnalysisChart chartData={chartData} />
        </Tile>
    );
};

export default TransactionsYearlyAnalysis;
