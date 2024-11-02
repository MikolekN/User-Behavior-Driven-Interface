import { useEffect, useState, useContext } from 'react';
import './TransactionsAnalysis.css';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import { isZodError } from '../../schemas/common/commonValidators';

const TransactionsMonthlyAnalysis = () => {
    const { user } = useContext(UserContext);
    const { chartData, fetchTransfersAnalysis } = useContext(TransferContext);

    const [ loading, setLoading ] = useState(true);
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const [ errorMessage, setErrorMessage ] = useState('');
    
    useEffect(() => {
        if (!user) return;

        const fetchChartData = async () => {
            try {
                const requestBody = {
                    year: new Date().getUTCFullYear()
                };
                const interval = 'monthly';
                await fetchTransfersAnalysis(interval, requestBody);
            } catch (error) {
                if (isZodError(error)) {
                    setErrorMessage('zod api validation error');
                } else {
                    setErrorMessage((error as Error).message || 'An unknown error occurred. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        void fetchChartData();
    }, [user, fetchTransfersAnalysis]);

    useEffect(() => {
        if (errorMessage) {
            setApiError({ 
                isError: true, 
                errorMessage 
            });
        }
    }, [errorMessage]);

    if (!user) return <Navigate to="/login" />;
    
    if (loading) return <div>Loading...</div>;

    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title="Transactions monthly analysis"
                alertTitle="No transactions history to generate analysis yet"
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transactions monthly analysis" className="w-4/5">
                <TransfersAnalysisChart chartData={chartData} truncateText={true}/>
            </Tile>
        </div>

    );
};

export default TransactionsMonthlyAnalysis;