import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import arrowUpDark from '../../assets/images/chevron-up-dark.svg';
import arrowDownDark from '../../assets/images/chevron-down-dark.svg';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';

const TransactionsHistory = () => {
    const { t } = useTranslation();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const { transfers, fetchTransfers } = useContext(TransferContext);
    const { apiError, handleError } = useApiErrorHandler();
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    
    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                await fetchTransfers();
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false); // TUTAJ CHYBA TROCHĘ BEZ SENSU BO I TAK NIGDZIE NIE JEST USTAWIANE NA true
            }
        };

        void fetchTransactions();
    }, [user, fetchTransfers]);

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

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

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
        <div id="transactions-history-wrapper" className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={t('transactionHistory.tile.title')} id="transactions-history-tile" className='flex flex-col w-1/3 shadow-md h-[95%] max-h-[95%] mb-2.5 mx-auto rounded-lg'>
                {!transfers && (
                    <div>Transactions History are loading...</div>
                )}
                {transfers && transfers.length > 0 && (
                    <div id="transaction-container" className='flex flex-col gap-4 overflow-y-auto p-2.5'>
                        {transfers.map((transfer) => {
                            const isExpanded = expandedGroups[transfer.date];
                            return (
                                <div id="transaction-group" className='mb-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm' key={transfer.date}>
                                    <div
                                        id="transaction-date"
                                        className='dark:text-gray-300 bg-gray-200 dark:bg-gray-800 p-2 font-semibold rounded mb-1 text-center w-full flex justify-between items-center
                                            cursor-pointer transition-[background-color] duration-[0.3s] hover:bg-gray-300 dark:hover:bg-gray-700'
                                        onClick={() => toggleGroup(transfer.date)}
                                    >
                                        {transfer.date}
                                        <span id='toggle-icon' className='text-sm ml-2'>
                                            {isExpanded ? <img src={isDarkMode ? arrowUpDark : arrowUp} alt="▼" /> : <img src={isDarkMode ? arrowDownDark : arrowDown} alt="▶" />}
                                        </span>
                                    </div>
                                    <div id='transaction-rows' className={`max-h-0 overflow-hidden transition-[max-height] duration-[0.5s] ease-[ease-in-out] ${isExpanded ? 'max-h-max' : ''}`} >
                                        {transfer.transactions.map((item, index) => (
                                            <div id="transaction-row" key={index} className='p-3 dark:text-gray-300 bg-white dark:bg-gray-600 rounded mb-1 flex justify-between items-center shadow-sm transition-[background-color] duration-[0.2s] ease-[ease]'>
                                                <div>
                                                    <span id="issuer-name" className="text-base font-semibold block">{item.issuerName}</span>
                                                    <span id="transaction-title" className='text-sm font-normal mt-1 block'>
                                                        <i>{item.title}</i>
                                                    </span>
                                                </div>
                                                <div
                                                    id='transaction-amount'
                                                    className={`font-semibold ${
                                                        item.income ? 'text-green-500' : 'text-red-500'
                                                    }`}
                                                >
                                                    {!item.income && <span>-</span>}
                                                    {item.amount} {user!.currency}
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
