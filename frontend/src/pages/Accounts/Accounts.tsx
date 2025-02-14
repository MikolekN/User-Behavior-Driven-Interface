import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import DefaultLoadingSkeleton from '../../components/Loading/DefaultLoadingSkeleton';
import { AccountContext } from '../../context/AccountContext';
import AccountsList from '../../components/AccountsList/AccountsList';

const Accounts = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { apiError, handleError } = useApiErrorHandler();
    const [ loading, setLoading ] = useState(true);
    const { accounts, getAccounts } = useContext(AccountContext);

    useEffect(() => {
        if (!user) return;
        const fetchAccounts = async () => {
            try {
                await getAccounts();
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchAccounts();
    }, [user, getAccounts]);

    if (loading) return <DefaultLoadingSkeleton />;
    
    if (apiError.isError) {
        return (
            <EmptyResponseInfoAlert
                title={t('accountList.tile.title')}
                alertTitle={t('accountList.emptyList')}
                alertMessage={apiError.errorMessage}
            >
                <Link to={'/create-cyclic-payment/'} className="justify-self-end p-2">
                    <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('accountList.submit')}</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    }

    return (
        <div id='cyclic-payments-wrapper' className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={t('accountList.tile.title')} className='flex flex-col w-1/2 mx-auto mb-2.5 bg-white shadow-md rounded-lg min-h-1/2 max-h-[95%]'>
                <div className="flex flex-col gap-4 overflow-y-auto p-2.5">
                    {!accounts && (
                        <div>Accounts are loading...</div>
                    )}
                    {accounts && accounts.length > 0 && (
                        <AccountsList accountsList={accounts} />
                    )}
                </div>
            </Tile>
        </div>
    );
};

export default Accounts;
