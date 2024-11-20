import Tile from '../components/Tile/Tile';
import './Info.css';

const Info = () => {
    return (
        <div className="info-wrapper">
            <Tile title="Informacje Kontaktowe" className="info-tile">
                <div className="info-sections">
                    <div className="info-section">
                        <h3>Kontakt Telefoniczny</h3>
                        <p>Jeśli chcesz się z nami skontaktować telefonicznie, możesz zadzwonić na:</p>
                        <ul>
                            <li><strong>Infolinia:</strong> +48 123 456 789</li>
                            <li><strong>Wsparcie Techniczne:</strong> +48 987 654 321</li>
                            <li><strong>Obsługa Klienta:</strong> +48 555 666 777</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>Kontakt Mailowy</h3>
                        <p>Masz pytania? Napisz do nas na:</p>
                        <ul>
                            <li><strong>E-mail:</strong> kontakt@naszbank.pl</li>
                            <li><strong>Reklamacje:</strong> reklamacje@naszbank.pl</li>
                            <li><strong>Wsparcie Techniczne:</strong> wsparcie@naszbank.pl</li>
                        </ul>
                    </div>

                    <div className="info-section">
                        <h3>Adres Siedziby</h3>
                        <p>Odwiedź nas osobiście pod adresem:</p>
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
