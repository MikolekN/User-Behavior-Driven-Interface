import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import './TransactionsHistory.css';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import { TransferContext } from '../../context/TransferContext';

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
    const { user } = useContext(UserContext);
    const { transfers, fetchTransfers } = useContext(TransferContext);
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });

    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                await fetchTransfers();
            } catch (error) {
                setApiError({
                    isError: true,
                    errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                });
            } finally {
                setLoading(false);
            }
        };

        void fetchTransactions();
    }, [user, fetchTransfers]);

    const toggleGroup = (date: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    if (!user) return <Navigate to="/login" />;
    if (loading) return <div>Loading...</div>;
    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title="Transactions History"
                alertTitle="No transactions history yet"
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (





<div className="transactions-history-wrapper">
            <Tile title="Transactions History" className="transactions-history-tile">
                {!groupedTransactions && (
                    <div>Transactions History are loading...</div>
                )}
                {groupedTransactions && groupedTransactions.length > 0 && (
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





        <Tile title="Transactions History" className="table-tile">
            <div className="flex justify-center p-8">
                {!transfers &&
                    <tr>
                        <td colSpan={5} className="text-center">
                            <div>
                                Transactions History are loading
                            </div>
                        </td>
                    </tr>
                }
                {transfers && transfers.length > 0 &&
                    <table className="table-fixed w-9/12">
                        <tbody>
                            {transfers.map((transaction) => (
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
                )}
            </Tile>
        </div>
    );
};

export default TransactionsHistory;
