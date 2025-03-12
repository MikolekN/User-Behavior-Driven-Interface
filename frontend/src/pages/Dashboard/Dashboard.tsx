import { Link } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { AccountContext } from '../../context/AccountContext';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const { t } = useTranslation();
    const { activeAccount, setAccount, getActiveAccount } = useContext(AccountContext);
    const { getUser } = useContext(UserContext);

    useEffect(() => {
        const getUserActiveAccount = async () => {
            try {
                await getActiveAccount();
            } catch {
                setAccount(null);
            }
        }

        getUserActiveAccount();
    }, [getUser, getActiveAccount]);

    return (
        activeAccount === null ? (
            <ActiveAccountError />
        ) : (
            <Tile id="dashboard" title={activeAccount!.accountName}>
                <div className="flex flex-col md:flex-row p-1 md:p-5 justify-center items-center">
                    <div className="order-2 md:order-1 flex flex-col items-center min-w-fit">
                        <p>{t('dashboard.balance') + ': '}{activeAccount!.balance} {activeAccount!.currency}</p>
                        <p>{t('dashboard.blockades') + ': '}{activeAccount!.blockades} {activeAccount!.currency}</p>
                        <div className='pb-4'>
                            <div className='border-t border-gray-300 my-3.5 w-full' />
                            <p className='font-semibold'>{t('dashboard.availableFunds') + ': '}{activeAccount!.availableFunds} {activeAccount!.currency}</p>
                        </div>
                    </div>
                    <div className="order-1 mb-4 md:mb-0 md:ml-4 flex md:flex-col items-center justify-center">
                        <div className='flex items-center'>
                            <svg className="w-5 h-5 mr-1 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 512 512">
                                <path d="M103 54.6c-10.5 2.8-19.3 10.1-24.4 20.2-3.1 6.2-3.1 6.2-7.5 47.2l-3.6 33.5-18.5.6c-20.4.6-23.8 1.4-32.5 7.4-6.1 4.2-9.8 8.7-13.3 16.3l-2.7 5.7v244.1l3.8 7.6c4.4 8.9 9.2 13.6 18.7 18.2l6.5 3.1h189c149.8 0 189.9-.3 193.2-1.3 10-3 20.4-12.8 24.5-23.2 2-4.9 2.2-7.8 2.6-27.6l.4-22.1 12.1.1c10.6.1 12.9-.2 17.9-2.2 10.6-4.3 20.1-15.2 22.7-26.2 1.8-7.4 20.3-232.8 19.6-239-1.2-11.7-9.8-24.1-20.3-29.4-2.7-1.4-7.8-3-11.3-3.6-6.3-1.1-363.7-31.1-368.8-30.9-1.4 0-5.1.7-8.1 1.5M293 88c99.8 8.3 183.3 15.5 185.5 16.1 5.2 1.5 12.1 8.3 13 12.9.3 2-3.7 55.5-9 118.9-10.2 122.2-9.9 119.5-15.2 124.3-4.3 3.9-9.2 5-19 4.3l-9.2-.7-.3-88.6-.3-88.7-2.4-6c-3.3-8.3-13.3-18.3-21.6-21.6l-6-2.4-160.2-.3L88 156v-2.3c0-4.3 6.9-66.3 7.6-68.2 2-5.6 10.1-12.3 14.9-12.5.6 0 82.7 6.7 182.5 15m112.5 89.1c5.1 1.4 11 7.3 12.4 12.4.6 2.2 1.1 8.8 1.1 14.7V215H20v-11.3c0-13.5.9-17.3 5.4-21.6 6.6-6.4-6.4-6 193.6-6.1 130.2 0 183.6.3 186.5 1.1m13.3 79.1.2 20.8H20v-42l199.3.2 199.2.3zm.2 103c0 40.4-.4 63.6-1.1 66.1-.5 2.1-2.4 5.3-4 7.2-6.2 7.1 9 6.6-196.5 6.3l-185-.3-3.6-2.4c-1.9-1.3-4.6-4-5.9-5.9l-2.4-3.6-.3-64.8L20 297h399z"></path>
                                <path d="m273.7 329.8-2.7 2.8v70.6l2.9 2.9 2.9 2.9h51.7c33.5 0 52.3-.4 53.6-1 4.6-2.5 4.9-4.8 4.9-40s-.3-37.5-4.9-40c-1.3-.6-20.2-1-53.8-1h-51.9zM367 368v21h-76v-42h76z"></path>
                            </svg>
                            <p>{activeAccount!.accountNumber}</p>
                        </div>
                        <Link to="/transfer" className='hidden md:block mt-2'>
                            <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">{t('dashboard.transfer')}</Button>
                        </Link>
                    </div>
                    <div className="order-2 w-fit md:hidden">
                        <Link to="/transfer">
                            <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">{t('dashboard.transfer')}</Button>
                        </Link>
                    </div>
                </div>
            </Tile>
        )
    );
};

export default Dashboard;
