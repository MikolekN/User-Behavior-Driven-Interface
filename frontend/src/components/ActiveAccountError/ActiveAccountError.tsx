import Tile from '../Tile/Tile';
import { useTranslation } from 'react-i18next';
import InfoAlert from '../Alerts/InfoAlert';

const ActiveAccountError = () => {
    const { t } = useTranslation();
    
    return (
        <Tile title={t('dashboard.userDontHaveAccount')} id="account-not-set" className="min-w-fit w-1/3 flex flex-col p-2.5">
            <div className="grid p-8 mt-2">
                <InfoAlert alertTitle={t('errors.api.activeAccountNotSet')} alertMessage={t('accountList.activeAccountNotSet')} />
            </div>
        </Tile>
    );
};

export default ActiveAccountError;