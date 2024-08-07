import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State variable to manage authentication status

  return (
    <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
    </Layout>
  );
};

export default App;
