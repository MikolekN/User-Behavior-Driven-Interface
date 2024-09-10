import { Navigate, useOutletContext } from 'react-router-dom';
import AccountDetailsTile from '../components/AccountDetailsTile/AccountDetailsTile';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user }: AuthContext = useOutletContext();

  if (!user) return <Navigate to="/login" />;

  return (
      <AccountDetailsTile />
  );
};

export default Dashboard;
