import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import './TransactionsHistory.css';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import { TransferContext } from '../../context/TransferContext';
import { isZodError } from '../../schemas/common/commonValidators';

const TransactionsHistory = () => {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const { transfers, fetchTransfers } = useContext(TransferContext);
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const [ errorMessage, setErrorMessage ] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                await fetchTransfers();
            } catch (error) {
                if (isZodError(error)) {
                    setErrorMessage('zod api validation error');
                } else {
                    setErrorMessage((error as Error).message || 'An unknown error occurred. Please try again.');
                }
            } finally {
                setLoading(false); // TUTAJ CHYBA TROCHĘ BEZ SENSU BO I TAK NIGDZIE NIE JEST USTAWIANE NA true
            }
        };

        void fetchTransactions();
    }, [user, fetchTransfers]);

    useEffect(() => {
        if (errorMessage) {
            setApiError({ 
                isError: true, 
                errorMessage 
            });
        }
    }, [errorMessage]);

    useEffect(() => {
        if (transfers && transfers.length > 0) {
            const mostRecentDate = transfers[0].date;
            setExpandedGroups({ [mostRecentDate]: true });
        }
    }, [transfers])

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
                {!transfers && (
                    <div>Transactions History are loading...</div>
                )}
                {transfers && transfers.length > 0 && (
                    <div className="transaction-container">
                        {transfers.map((transfer) => {
                            const isExpanded = expandedGroups[transfer.date];

                            return (
                                <div className="transaction-group" key={transfer.date}>
                                    <div
                                        className="transaction-date"
                                        onClick={() => toggleGroup(transfer.date)}
                                    >
                                        {transfer.date}
                                        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
                                            {isExpanded ? <img src={arrowUp} alt="▼" /> : <img src={arrowDown} alt="▶" />}
                                        </span>
                                    </div>
                                    <div className={`transaction-rows ${isExpanded ? 'expanded' : 'collapsed'}`} >
                                        {transfer.transactions.map((item, index) => (
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
                )}
            </Tile>
        </div>
    );
};

export default TransactionsHistory;
