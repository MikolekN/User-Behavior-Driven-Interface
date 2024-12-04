import Tile from '../components/Tile/Tile';
import './Info.css';
import { useTranslation } from 'react-i18next';

const Info = () => {
    const { t } = useTranslation();

    return (
        <div className="info-wrapper">
            <Tile title={t('contact.tile.title')} className="info-tile">
                <div className="info-sections">
                    <div className="info-section">
                        <h3>{t('contact.phoneContact.title')}</h3>
                        <p>{t('contact.phoneContact.message')}:</p>
                        <ul>
                            <li><strong>{t('contact.phoneContact.hotline')}:</strong> +48 123 456 789</li>
                            <li><strong>{t('contact.phoneContact.customerService')}:</strong> +48 987 654 321</li>
                            <li><strong>{t('contact.phoneContact.technicalSupport')}:</strong> +48 555 666 777</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>{t('contact.emailContact.title')}</h3>
                        <p>{t('contact.emailContact.message')}:</p>
                        <ul>
                            <li><strong>{t('contact.emailContact.email')}:</strong> kontakt@naszbank.pl</li>
                            <li><strong>{t('contact.emailContact.complaint')}:</strong> reklamacje@naszbank.pl</li>
                            <li><strong>{t('contact.emailContact.technicalSupport')}:</strong> wsparcie@naszbank.pl</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>{t('contact.address.title')}</h3>
                        <p>{t('contact.address.message')}:</p>
                        <address>
                            ul. Bankowa 1<br />
                            00-001 Warszawa, Polska
                        </address>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Info;
