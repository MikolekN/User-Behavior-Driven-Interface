import { useEffect, useState } from 'react';
import './TransactionsAnalysis.css';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, useOutletContext } from 'react-router-dom';
import Tile from '../Tile/Tile';
import { fetchTransfersAnalysisData } from '../utils/apiService';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import { ChartData } from '../utils/types/TransfersAnalysisChartTypes';

const TransactionsAnalysis = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user }: AuthContext = useOutletContext();

    if (!user) return <Navigate to="/login" />

    useEffect(() => {
        const fetchTransfersAnalysisMonthly = async () => {
            const url = 'http://127.0.0.1:5000/api/transfers/analysis/yearly';
            const body = { 
                startYear: new Date().getUTCFullYear() - 2,
                endYear: new Date().getUTCFullYear() + 2
            };   
            fetchTransfersAnalysisData(url, body, setChartData, setLoading, setError);
        };

        fetchTransfersAnalysisMonthly();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Tile title="Transactions yearly analysis" className="w-1/2">
            <TransfersAnalysisChart chartData={chartData} />
        </Tile>        
    )
}

export default TransactionsAnalysis;