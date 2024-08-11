import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State variable to manage authentication status
  const [username, setUsername] = useState("");

  return (
    <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername}>
      <Outlet context={{ isLoggedIn, setIsLoggedIn, username, setUsername }} />
    </Layout>
  );
};

export default App;
