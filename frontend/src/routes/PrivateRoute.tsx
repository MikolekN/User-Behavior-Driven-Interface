import { ReactNode, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children?: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { user } = useContext(UserContext);
    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;