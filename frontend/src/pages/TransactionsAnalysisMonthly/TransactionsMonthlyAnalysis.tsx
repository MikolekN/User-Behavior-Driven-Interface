import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../../components/Tile/Tile';
import TransfersAnalysisChart from '../../components/TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import ChartLoadingSkeleton from '../../components/Loading/ChartLoadingSkeleton';
import FormSelect from '../../components/FormSelect/FormSelect';
import Button from '../../components/utils/Button';
import { DEFAULT_MONTH, LIMIT_MONTHS_SELECT_OPTIONS, MINIUM_YEAR_IN_YEARLY_ANALYSIS, MONTHLY_ANALYSIS_DISPLAYED_MONTHS_DEFAULT_LIMIT, MONTHLY_ANALYSIS_INTERVAL_REQUEST_PARAMETER, MONTHS_IN_YEAR } from '../../pages/constants';

const ANALYSIS_INTERVAL: string = MONTHLY_ANALYSIS_INTERVAL_REQUEST_PARAMETER;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR: number = MINIUM_YEAR_IN_YEARLY_ANALYSIS;

export const YEAR_SELECT_OPTIONS = Array.from({ length: CURRENT_YEAR - (MIN_YEAR - 1) }, (_, i) => {
    const year = MIN_YEAR + i;
    return { value: String(year), key: String(year) };
});

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
        <Tile title={t('transactionsMonthlyAnalysis.tile.title')}>
            <TransfersAnalysisChart chartData={chartData} truncateText={true}/>
        </Tile>
    );
};

export default TransactionsMonthlyAnalysis;
