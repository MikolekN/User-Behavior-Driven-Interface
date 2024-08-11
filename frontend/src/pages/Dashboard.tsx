import { useOutletContext } from 'react-router-dom';
import TestDetailsTile from '../components/TestDetailsTile/TestDetailsTile';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { username }: AuthContext = useOutletContext();

  return (
    <>
      <div>Dashboard</div>
      <p>Hello {username}</p>
      <TestDetailsTile />
      <TestDetailsTile />
    </>
  );
};

export default Dashboard;
