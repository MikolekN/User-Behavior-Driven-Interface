import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import './TransactionsHistory.css';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';

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
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/transfers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Network response was not ok');

                const data = (await response.json()) as TransfersResponse;
                setGroupedTransactions(data.transfers);

                if (data.transfers.length > 0) {
                    const mostRecentDate = data.transfers[0].date;
                    setExpandedGroups({ [mostRecentDate]: true });
                }
            } catch (error) {
                setError(true);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchTransactions();
    }, [user]);

    const toggleGroup = (date: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

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
        <div className="transactions-history-wrapper">
            <Tile title="Transactions History" className="transactions-history-tile">
                <div className="transaction-container">
                    {groupedTransactions.map((group) => {
                        const isExpanded = expandedGroups[group.date];

                        return (
                            <div className="transaction-group" key={group.date}>
                                <div
                                    className="transaction-date"
                                    onClick={() => toggleGroup(group.date)}
                                >
                                    {group.date}
                                    <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                                        {isExpanded ? <img src={arrowUp} alt="▼" /> : <img src={arrowDown} alt="▶" />}
                                    </span>
                                </div>
                                <div className={`transaction-rows ${isExpanded ? 'expanded' : 'collapsed'}`} >
                                    {group.transactions.map((item, index) => (
                                        <div className="transaction-row" key={index}>
                                            <div>
                                                <span className="issuer-name block">{item.issuer_name}</span>
                                                <span className="transaction-title block">
                                                    <i>{item.title}</i>
                                                </span>
                                            </div>
                                            <div
                                                className={`transaction-amount ${
                                                    item.income ? 'transaction-income' : 'transaction-expense'
                                                }`}
                                            >
                                                {!item.income && <span>-</span>}
                                                {item.amount} {user.currency}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Tile>
        </div>
    );
};

export default TransactionsHistory;
