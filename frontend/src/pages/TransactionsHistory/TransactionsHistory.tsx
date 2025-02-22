import { useEffect, useState, useContext } from 'react';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import { AccountContext } from '../../context/AccountContext';
import { UserContext } from '../../context/UserContext';
import DefaultLoadingSkeleton from '../../components/Loading/DefaultLoadingSkeleton';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import Tile from '../../components/Tile/Tile';
import CollapsibleList from '../../components/CollapsibleList/CollapsibleList';

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
            <Tile
                title={t('transactionHistory.tile.title')}
                id="transactions-history"
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
                                            {item.amount} {account?.currency}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    />
                )}
            </Tile>
    );
};

export default TransactionsHistory;
