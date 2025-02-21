import { Link } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import icon from '../../assets/images/credit-card.png';
import iconDark from '../../assets/images/credit-card-dark.png';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';

const Dashboard = () => {
    const { t } = useTranslation();
    const { account } = useContext(AccountContext);

    return (
        account === null ? (
            <ActiveAccountError />
        ) : (
            <Tile id="dashboard" title={account!.accountName}>
                <div className="flex flex-col md:flex-row p-1 md:p-5 justify-center items-center">
                    <div className="order-2 md:order-1 flex flex-col items-center min-w-fit">
                        <p>{t('dashboard.balance') + ': '}{account!.balance} {account!.currency}</p>
                        <p>{t('dashboard.blockades') + ': '}{account!.blockades} {account!.currency}</p>
                        <div className='pb-4'>
                            <div className='border-t border-gray-300 my-3.5 w-full' />
                            <p className='font-semibold'>{t('dashboard.availableFunds') + ': '}{account!.availableFunds} {account!.currency}</p>
                        </div>
                    </div>
                    <div className="order-1 mb-4 md:mb-0 md:ml-4 flex md:flex-col items-center justify-center">
                        <div className='flex items-center'>
                            <img src={icon} alt="" className="dark:hidden w-5 h-5 mr-1.5" />
                            <img src={iconDark} alt="" className="hidden dark:block w-5 h-5 mr-1.5" />
                            <p>{account!.accountNumber}</p>
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
