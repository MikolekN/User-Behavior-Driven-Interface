import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default Home;
