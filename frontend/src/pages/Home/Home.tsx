import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Home: React.FC = () => {
    const { user } = useContext(UserContext);

    if (user) {
        return <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default Home;
