import React from 'react';
import TestDetailsTile from '../components/TestDetailsTile/TestDetailsTile';
import MainMenu from '../components/MainMenu/MainMenu';

const Dashboard = () => {
  return (
    <>
      <MainMenu />
      <div>Dashboard</div>
      <TestDetailsTile />
      <TestDetailsTile />
    </>
  );
};

export default Dashboard;
