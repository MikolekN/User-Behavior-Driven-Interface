import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccountDetailsTile from '../components/AccountDetailsTile/AccountDetailsTile';

const Dashboard = () => {
  return (
    <>
      <AccountDetailsTile />
    </>
  );
};

export default Dashboard;
