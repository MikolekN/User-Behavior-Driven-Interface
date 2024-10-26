import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import '../utils/styles/table.css';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';

const TransactionsHistory = () => {
    const { user } = useContext(UserContext);
    const { transfers, fetchTransfers } = useContext(TransferContext);

    const [ loading, setLoading ] = useState(true);
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