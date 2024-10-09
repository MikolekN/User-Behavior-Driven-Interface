import { useEffect, useState, useContext } from 'react';
import './TransactionsAnalysis.css';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Tile from '../Tile/Tile';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import { ChartData } from '../utils/types/TransfersAnalysisChartTypes';
import { fetchTransfersAnalysisData } from '../../services/apiService';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';

const TransactionsYearlyAnalysis = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;
        const fetchTransfersAnalysisMonthly = async () => {
            const url = 'http://127.0.0.1:5000/api/transfers/analysis/yearly';
            const body = {
                startYear: new Date().getUTCFullYear() - 2,
                endYear: new Date().getUTCFullYear() + 2
            };
            fetchTransfersAnalysisData(url, body, setChartData, setLoading, setError);
        };

        fetchTransfersAnalysisMonthly();
    }, [user]);

    if (!user) return <Navigate to="/login" />

    if (loading) return <div>Loading...</div>;
    
    if (error) { 
        return (
            <EmptyResponseInfoAlert
                title="Transactions yearly analysis"
                alertTitle="No transactions history to generate analysis yet"
                alertMessage="transactions to display in transactions yearly analysis"
            />
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transactions yearly analysis" className="w-4/5">
                <TransfersAnalysisChart chartData={chartData} />
            </Tile>
        </div>

    )
}

export default TransactionsYearlyAnalysis;