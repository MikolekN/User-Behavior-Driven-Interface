import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccountDetailsTile from '../components/AccountDetailsTile/AccountDetailsTile';

const Dashboard = () => {
  const { username }: AuthContext = useOutletContext();

  return (
    <>
      <div>Dashboard</div>
      <p>Hello {username}</p>
      <AccountDetailsTile />
    </>
  );
};

export default Dashboard;
