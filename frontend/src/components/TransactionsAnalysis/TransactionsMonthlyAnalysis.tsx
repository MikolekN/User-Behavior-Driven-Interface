import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import ChartLoadingSkeleton from '../Loading/ChartLoadingSkeleton';
import Button from '../utils/Button';
import FormSelect from '../FormSelect/FormSelect';
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

    const [year, setYear] = useState(CURRENT_YEAR);
    const [startMonth, setStartMonth] = useState(DEFAULT_MONTH); // January
    const [limit, setLimit] = useState(MONTHLY_ANALYSIS_DISPLAYED_MONTHS_DEFAULT_LIMIT); // 3 months at time

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value));
    };
  
    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value));
        setStartMonth(DEFAULT_MONTH);
    };

    const getMonthlyAnalysisRequestBody = (year: number, startMonth: number, limit: number) => {
        return {
            year: year,
            start_month: startMonth,
            limit: limit
        };
    };

    useEffect(() => {
        if (!user) return;

        const fetchChartData = async () => {
            try {
                const requestBody = getMonthlyAnalysisRequestBody(year, startMonth, limit);
                await fetchTransfersAnalysis(ANALYSIS_INTERVAL, requestBody);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchChartData();
    }, [user, fetchTransfersAnalysis, year, startMonth, limit]);

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
        <Tile title={t('transactionsMonthlyAnalysis.tile.title')} className="md:w-10/12">

            <div className="hidden md:block">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center justify-between gap-x-6">
                        <FormSelect
                            label={t('transactionsMonthlyAnalysis.yearSelectLabel')}
                            options={YEAR_SELECT_OPTIONS}
                            onChange={handleYearChange}
                            defaultValue={year.toString()}
                        />
                        <FormSelect 
                            label={t('transactionsMonthlyAnalysis.limitSelectLabel')}
                            options={LIMIT_MONTHS_SELECT_OPTIONS}
                            onChange={handleLimitChange}
                            defaultValue={limit.toString()}
                        />
                    </div>
                    {limit !== MONTHS_IN_YEAR && 
                        <div>
                            <Button onClick={() => setStartMonth(startMonth - 1)} disabled={startMonth === 1} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent mr-2">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
                                </svg>
                            </Button>
                            <Button onClick={() => setStartMonth(startMonth + 1)} disabled={startMonth + limit > 12} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
                                </svg>
                            </Button>
                        </div>
                    }
                </div>
            </div>
            <div className="md:hidden">
                    <div className="w-full flex flex-col justify-center">
                        <FormSelect
                            label={t('transactionsMonthlyAnalysis.yearSelectLabel')}
                            options={YEAR_SELECT_OPTIONS}
                            className="w-full"
                            onChange={handleYearChange}
                            defaultValue={year.toString()}
                        />
                        <FormSelect 
                            label={t('transactionsMonthlyAnalysis.limitSelectLabel')}
                            options={LIMIT_MONTHS_SELECT_OPTIONS}
                            className="w-full"
                            onChange={handleLimitChange}
                            defaultValue={limit.toString()}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button onClick={() => setStartMonth(startMonth - 1)} disabled={startMonth === 1} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent mr-2">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
                            </svg>
                        </Button>
                        <Button onClick={() => setStartMonth(startMonth + 1)} disabled={startMonth + limit > 12} className="bg-transparent hover:bg-transparent cursor-pointer focus:ring-transparent">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
                            </svg>
                        </Button>
                    </div>
            </div>
            
            <TransfersAnalysisChart chartData={chartData} truncateText={true}/>
        </Tile>
    );
};

export default TransactionsMonthlyAnalysis;
