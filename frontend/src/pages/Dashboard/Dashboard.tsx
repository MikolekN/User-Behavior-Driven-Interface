import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import icon from '../../assets/images/credit-card.png';
import iconDark from '../../assets/images/credit-card-dark.png';

const Dashboard = () => {
    const { user } = useContext(UserContext);

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex items-center justify-center">
            <Tile title={user.accountName} id="dashboard" className="min-w-fit w-1/3 flex flex-col p-2.5">
                <div className="text-black dark:text-gray-400 flex flex-col md:flex-row p-5 justify-center items-center">
                    <div className="order-2 md:order-1 flex flex-col items-center min-w-fit mb-4">
                        <p>Balance: {user.balance} {user.currency}</p>
                        <p>Blockades: {user.blockades} {user.currency}</p>
                        <div>
                            <div className='border-t border-gray-300 my-3.5 w-full' />
                            <p className='font-semibold text-black dark:text-gray-400 '>Available Funds: {user.availableFunds} {user.currency}</p>
                        </div>
                    </div>
                    <div className="order-1 mb-4 md:mb-0 md:ml-4 flex md:flex-col items-center justify-center">
                        <div className='flex items-center'>
                            <img src={icon} alt="" className="dark:hidden w-5 h-5 mr-1.5" />
                            <img src={iconDark} alt="" className="hidden dark:block w-5 h-5 mr-1.5" />
                            <p>{user.accountNumber}</p>
                        </div>
                        <Link to="/transfer" className='hidden md:block mt-2'>
                            <Button>Transfer</Button>
                        </Link>
                    </div>
                    <div className="order-2 w-fit md:hidden">
                        <Link to="/transfer">
                            <Button>Transfer</Button>
                        </Link>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Dashboard;