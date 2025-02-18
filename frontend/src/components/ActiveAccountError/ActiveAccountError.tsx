import Tile from '../Tile/Tile';
import { Link } from 'react-router-dom';
import Button from '../utils/Button';
import { useTranslation } from 'react-i18next';

const ActiveAccountError = () => {
    const { t } = useTranslation();
    
    return (
        <Tile title={t('dashboard.userDontHaveAccount')} id="account-not-set" className="min-w-fit w-1/3 flex flex-col p-2.5">
            <div className="grid p-8 border border-gray-400 rounded-lg mt-2">
                <div className="text-black dark:text-gray-400 md:flex-row p-2 justify-self-center">
                    {t('accountList.activeAccountNotSet')}
                </div>
                <Link to={'/accounts'} className="justify-self-end p-2">
                    <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">{t('accountList.tile.title')}</Button>
                </Link>
            </div>
        </Tile>
    );
};

export default ActiveAccountError;