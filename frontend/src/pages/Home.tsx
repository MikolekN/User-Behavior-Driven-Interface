import React from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.tsx'

const Home: React.FC = () => {
  const { isLoggedIn }: AuthContext = useOutletContext();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default Home;
