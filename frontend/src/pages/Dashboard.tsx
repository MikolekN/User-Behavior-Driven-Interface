import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AccountDetailsTile from '../components/AccountDetailsTile/AccountDetailsTile';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext) || { user: null, fetchUser: () => Promise.resolve() };

  if (!user) return <Navigate to="/login" />;

  return (
      <AccountDetailsTile />
  );
};

export default Dashboard;
