import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import '../utils/styles/table.css';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';

interface TransfersResponse {
    transfers: TransactionsHistoryType[];
}

interface TransactionsHistoryType {
    date: string;
    transactions: Transaction[];
}

interface Transaction {
    created: string;
    issuer_name: string;
    title: string;
    amount: number;
    income: boolean;
    test: string;
}

const TransactionsHistory = () => {
    const [groupedTransactions, setGroupedTransactions] = useState<TransactionsHistoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) return;
        
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/transfers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json() as TransfersResponse;
                setGroupedTransactions(data.transfers);
            } catch (error) {
                setError(true);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchTransactions();
    }, [user]);
    
    if (!user) return <Navigate to="/login" />;

    if (loading) return <div>Loading...</div>;

    if (error) { 
        return (
            <EmptyResponseInfoAlert
                title="Transactions History"
                alertTitle="No transactions history yet"
                alertMessage="transactions to display in transactions history"
            />
        );
    }

    return (
        <Tile title="Transactions History" className="table-tile">
            <div className="flex justify-center p-8">
                {!groupedTransactions &&
                    <tr>
                        <td colSpan={5} className="text-center">
                            <div>
                                Transactions History are loading
                            </div>
                        </td>
                    </tr>
                }
                {groupedTransactions && groupedTransactions.length > 0 &&
                    <table className="table-fixed w-9/12">
                        <tbody>
                            {groupedTransactions.map((transaction) => (
                                <>
                                    <tr className="bg-gray-200">
                                        <td colSpan={2} className="px-4 py-2 font-bold">
                                            {transaction.date}
                                        </td>
                                    </tr>
                                    {transaction.transactions.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-400">
                                            <td className="px-8 py-2">
                                                <div>
                                                    <span className="block py-1">
                                                        <b>{item.issuer_name}</b>
                                                    </span>
                                                    <span className="block py-1">
                                                        <i>{item.title}</i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-right px-8 py-2" style={{ color: item.income ? 'green' : 'red' }}>
                                                {!item.income && <span>-</span>}
                                                {item.amount} {user.currency}
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </Tile>
    );
};

export default TransactionsHistory;