import { useEffect, useState, useContext } from 'react';
import './TransactionsAnalysis.css';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Tile from '../Tile/Tile';
import { fetchTransfersAnalysisData } from '../utils/apiService';
import TransfersAnalysisChart from '../TransfersAnalysisChart/TransfersAnalysisChart';
import { ChartData } from '../utils/types/TransfersAnalysisChartTypes';

const TransactionsMonthlyAnalysis = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext) || { user: null, fetchUser: () => Promise.resolve() };
    
    useEffect(() => {
        if (!user) return;

        const fetchTransfersAnalysisMonthly = async () => {
            const url = 'http://127.0.0.1:5000/api/transfers/analysis/monthly';
            const body = { 
                year: new Date().getUTCFullYear(),
            };
            fetchTransfersAnalysisData(url, body, setChartData, setLoading, setError);
        };

        fetchTransfersAnalysisMonthly();
    }, [user]);

    if (!user) return <Navigate to="/login" />
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transactions monthly analysis" className="w-4/5">
                <TransfersAnalysisChart chartData={chartData} truncateText={true}/>
            </Tile>
        </div>
        
    )
}

export default TransactionsMonthlyAnalysis;