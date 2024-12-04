import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import icon from '../../assets/images/credit-card.png';
import FormSelect from '../../components/FormSelect/FormSelect';
import { LANGUAGES } from '../constants';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { user } = useContext(UserContext);

    if (!user) return <Navigate to="/login" />;

    const { i18n, t } = useTranslation();

    const handelChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang_code = e.target.value;
        i18n.changeLanguage(lang_code);
    }

    return (
        <div className="flex items-center justify-center">
            <FormSelect
                defaultValue={i18n.language}
                onChange={handelChangeLanguage}
                label='Select language'
                options={LANGUAGES}
            />
            <Tile title={user.accountName} id="dashboard" className="min-w-fit w-1/3 flex flex-col p-2.5">
                <div className="flex justify-between items-stretch p-5">
                    <div className="flex-grow flex flex-col items-center min-w-fit mr-5">
                        <p>{t('dashboard.balance')}: {user.balance} {user.currency}</p>
                        <p>{t('dashboard.blockades')}: {user.blockades} {user.currency}</p>
                        <div>
                            <div className='border-t border-gray-300 my-3.5 w-full' />
                            <p className='font-semibold text-gray-800'>{t('dashboard.availableFunds')}: {user.availableFunds} {user.currency}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center w-fit">
                        <div className="flex items-center mb-2.5">
                            <img src={icon} alt="" className="w-5 mr-1.5" />
                            <p>{user.accountNumber}</p>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="flex justify-center">
                            <Link to="/transfer">
                                <Button>{t('dashboard.transfer')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Dashboard;