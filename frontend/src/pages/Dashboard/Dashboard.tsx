import { Navigate, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import './Dashboard.css';
import icon from '../../assets/images/credit-card.png';

const Dashboard = () => {
    const { user }: AuthContext = useOutletContext();

    if (!user) return <Navigate to="/login" />;

    return (
        <Tile title={user.accountName} className="dashboard-tile">
            <div className="account-number-container" aria-label="Account number">
                <img src={icon} alt="Credit Card Icon" className="credit-card-icon" />
                <p className="account-number">{user.accountNumber}</p>
            </div>
            <div className="info-container">
                <div className="balance-info-section">
                    <p>Balance: {user.balance} {user.currency}</p>
                    <p>Blockades: {user.blockades} {user.currency}</p>
                    <div className='separator' />
                    <p className='available-funds'>Available Funds: {user.availableFunds} {user.currency}</p>
                </div>
                <div className="transfer-button" aria-label="Transfer Funds">
                    <Link to="/transfer">
                        <Button>Transfer</Button>
                    </Link>
                </div>
            </div>
        </Tile>
    );
};

export default Dashboard;
