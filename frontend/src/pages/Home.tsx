import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

interface AuthContext {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const Home: React.FC = () => {
  const { isLoggedIn }: AuthContext = useOutletContext();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Home;
