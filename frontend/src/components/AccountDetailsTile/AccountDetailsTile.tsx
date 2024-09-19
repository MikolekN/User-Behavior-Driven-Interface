import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Tile from '../Tile/Tile';
import './AccountDetailsTile.css';
import Button from '../utils/Button';
import { AuthContext } from '../../context/AuthContext';

const AccountDetailsTile = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <div>Loading...</div>; // In the future this component will be part of Dashboard.tsx and '!user' condition is handled there
    return (
        <Tile title={user.accountName} className="account-details-tile">
            <div>
                <p>{user.accountNumber}</p>
            </div>
            <div className="flex justify-end space-x-4 ml-10">
                <div className="p-4">
                    <p>Balance: {user.balance} {user.currency}</p>
                    <p>Blockades: {user.blockades} {user.currency}</p>
                </div>
                <div className="grid p-4">
                    <p className="border-l border-gray-500 pl-8">Available Funds: <br/> {user.availableFunds} {user.currency}</p>
                    <div className="justify-self-end pt-4 pl-4">
                        <Link to="/transfer">
                            <Button>Transfer</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Tile>
    )
}

export default AccountDetailsTile;
