import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../../components/Tile/Tile';
import TransfersAnalysisChart from '../../components/TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import ChartLoadingSkeleton from '../Loading/ChartLoadingSkeleton';
import Button from '../utils/Button';
import { MINIUM_YEAR_IN_YEARLY_ANALYSIS, YEAR_DISPLAYED_LIMIT, YEARLY_ANALYSIS_INTERVAL_REQUEST_PARAMETER } from '../../pages/constants';

const LIMIT: number = YEAR_DISPLAYED_LIMIT;
const MIN_YEAR: number = MINIUM_YEAR_IN_YEARLY_ANALYSIS;
const ANALYSIS_INTERVAL: string = YEARLY_ANALYSIS_INTERVAL_REQUEST_PARAMETER;
const CURRENT_YEAR: number = new Date().getFullYear();

const TransactionsYearlyAnalysis = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { chartData, fetchTransfersAnalysis } = useContext(TransferContext);
    const [ loading, setLoading ] = useState(true);
    const { apiError, handleError } = useApiErrorHandler();
    const [startYear, setStartYear] = useState(CURRENT_YEAR - LIMIT + 1);

    const getYearlyAnalysisRequestBody = (startYear: number) => {
        return {
            start_year: startYear,
            end_year: startYear + LIMIT - 1
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchChartData = async () => {
            try {
                const requestBody = getYearlyAnalysisRequestBody(startYear);
                await fetchTransfersAnalysis(ANALYSIS_INTERVAL, requestBody);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchChartData();
    }, [user, fetchTransfersAnalysis, startYear]);

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
        <Tile title={t('transactionsYearlyAnalysis.tile.title')} className="md:w-10/12">
            <div className="hidden md:block">
                <div className="w-full flex items-center justify-end">
                    <div>
                        <Button onClick={() => setStartYear(startYear - 1)} disabled={startYear === MIN_YEAR} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent mr-2">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
                            </svg>
                        </Button>
                        <Button onClick={() => setStartYear(startYear + 1)} disabled={startYear + LIMIT > CURRENT_YEAR} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                    <div className="flex justify-between mt-4">
                        <Button onClick={() => setStartYear(startYear - 1)} disabled={startYear === MIN_YEAR} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent mr-2">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
                            </svg>
                        </Button>
                        <Button onClick={() => setStartYear(startYear + 1)} disabled={startYear + LIMIT > CURRENT_YEAR} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
                            </svg>
                        </Button>
                    </div>
            </div>

            <TransfersAnalysisChart chartData={chartData} />
        </Tile>
    );
};

export default TransactionsYearlyAnalysis;
