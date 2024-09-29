import { Fragment, useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import '../utils/styles/table.css';

interface GroupedTransactions {
    [created: string]: Transaction[]
}

interface Transaction {
    created: string,
    issuer_name: string,
    title: string,
    amount: number,
    income: boolean
}

const TransactionsHistory = () => {
    const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;
        
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/transfers', {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json" 
                    },
                    credentials: "include"
                });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const transfers = data.transfers;
            const formattedTransactions = transfers.map((transaction: Transaction) => ({
                ...transaction,
                created: formatDate(new Date(transaction.created))
            }));
            const grouped = groupByDate(formattedTransactions);
            setGroupedTransactions(grouped);
            } catch (error) {
                setError(true);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [user]);
    
    if (!user) return <Navigate to="/login" />

    const formatDate = (creationDate: Date): string => {
        const month = creationDate.getUTCMonth() + 1
        const day = creationDate.getUTCDate();
        const year = creationDate.getUTCFullYear();

        const pMonth = month.toString().padStart(2,"0");
        const pDay = day.toString().padStart(2,"0");
        const date = `${pDay}/${pMonth}/${year}`;

        return date;
    }

    const groupByDate = (transactions: Transaction[]): GroupedTransactions => {
        return transactions.reduce((groups, transaction) => {
            const date = transaction.created;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
        }, {} as GroupedTransactions);
    };

    const compareDates = (a: string, b: string) => {
        // Convert date strings back to Date objects for comparison
        const dateA = new Date(a.split('/').reverse().join('-'));
        const dateB = new Date(b.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime(); // Sort in descending order
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Tile title="Transactions History" className="table-tile">
            <div className="flex justify-center p-8">
                <table className="table-fixed w-9/12">
                    <tbody>
                        {Object.keys(groupedTransactions)
                            .sort(compareDates)
                            .map(date => (
                                <Fragment key={date}>
                                    {/* Date Row */}
                                    <tr className="bg-gray-200">
                                        <td colSpan={2} className="px-4 py-2 font-bold">
                                            {date}
                                        </td>
                                    </tr>
                                    {/* Transactions Rows */}
                                    {groupedTransactions[date].map((transaction, index) => (
                                        <tr key={index} className="border-b border-gray-400">
                                            <td className="px-8 py-2">
                                                <div>
                                                    <span className="block py-1">
                                                        <b>{transaction.issuer_name}</b>
                                                    </span>
                                                    <span className="block py-1">
                                                        <i>{transaction.title}</i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-right px-8 py-2" style={{ color: transaction.income ? 'green' : 'red' }}>
                                                { !transaction.income && <span>-</span> }{transaction.amount} PLN
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Tile>
    );
};

export default TransactionsHistory;