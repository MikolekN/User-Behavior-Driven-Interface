import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Info.css';
import { AuthContext } from '../context/AuthContext';

const Info = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex items-center justify-center">
            <Tile title="Informacje Kontaktowe" className="info-tile">
                <div className="info-sections">
                    <div className="info-section">
                        <h3>Kontakt Telefoniczny</h3>
                        <p>Jeśli chcesz się z nami skontaktować telefonicznie, możesz zadzwonić na jeden z poniższych numerów:</p>
                        <ul>
                            <li>Infolinia: +48 123 456 789</li>
                            <li>Wsparcie Techniczne: +48 987 654 321</li>
                            <li>Obsługa Klienta: +48 555 666 777</li>
                        </ul>
                    </div>
                    <div className="info-section">
                        <h3>Kontakt Mailowy</h3>
                        <p>Masz pytania? Skontaktuj się z nami mailowo:</p>
                        <ul>
                            <li>Adres e-mail: kontakt@naszbank.pl</li>
                            <li>Reklamacje: reklamacje@naszbank.pl</li>
                            <li>Wsparcie Techniczne: wsparcie@naszbank.pl</li>
                        </ul>
                    </div>
                    <div className="info-section">
                        <h3>Adres Siedziby</h3>
                        <p>Jeśli chcesz odwiedzić nas osobiście, nasz adres to:</p>
                        <p>ul. Bankowa 1<br />00-001 Warszawa</p>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Info;
