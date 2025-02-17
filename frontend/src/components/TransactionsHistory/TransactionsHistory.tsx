import { useEffect, useState, useContext } from 'react';
import Tile from '../Tile/Tile';
import { UserContext } from '../../context/UserContext';
import EmptyResponseInfoAlert from '../EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import DefaultLoadingSkeleton from '../Loading/DefaultLoadingSkeleton';
import CollapsibleList from '../CollapsibleList/CollapsibleList';
import { AccountContext } from '../../context/AccountContext';

const TransactionsHistory = () => {
    const { t } = useTranslation();
    const [ loading, setLoading ] = useState(true);
    const { user } = useContext(UserContext);
    const { account } = useContext(AccountContext);
    const { transfers, fetchTransfers } = useContext(TransferContext);
    const { apiError, handleError } = useApiErrorHandler();
    
    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                await fetchTransfers();
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchTransactions();
    }, [user, fetchTransfers]);

    if (loading) return <DefaultLoadingSkeleton />;

    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title={t('transactionHistory.tile.title')}
                alertTitle={t('transactionHistory.emptyList')}
                alertMessage={apiError.errorMessage}
            />
        );
    }

    return (
        <div id="transactions-history-wrapper" className="flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full">
            <Tile
                title={t('transactionHistory.tile.title')}
                id="transactions-history-tile"
                className="flex flex-col w-1/3 shadow-md h-[95%] max-h-[95%] mb-2.5 mx-auto rounded-lg"
            >
                {!transfers || transfers.length === 0 ? (
                    <div>{t('transactionHistory.noTransactions')}</div>
                ) : (
                    <CollapsibleList
                        items={transfers}
                        renderHeader={(transfer) => (   
                            <span>{transfer.date}</span>
                        )}
                        renderDetails={(transfer) => (
                            <>
                                {transfer.transactions.map((item, index) => (
                                    <div id="transaction-row" key={index} className='p-3 bg-white rounded mb-1 flex justify-between items-center shadow-sm transition-[background-color] duration-[0.2s] ease-[ease] dark:text-gray-300 dark:bg-gray-600'>
                                        <div>
                                            <span id="issuer-name" className="text-base font-semibold block">{item.issuerName}</span>
                                            <span id="transaction-title" className='text-sm font-normal mt-1 block'>
                                            {item.title === 'loan' ? <i>{t(`transactionHistory.${item.title}`)}</i> : <i>{item.title}</i>}
                                            </span>
                                        </div>
                                        <div
                                            id='transaction-amount'
                                            className={`font-semibold ${
                                                item.income ? 'text-green-500' : 'text-red-500'
                                            }`}
                                        >
                                            {!item.income && <span>-</span>}
                                            {item.amount} {account!.currency}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    />
                )}
            </Tile>
        </div>
    );
};

export default TransactionsHistory;
