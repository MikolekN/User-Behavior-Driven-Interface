import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Transfer from '../pages/Transfer';
import Chat from '../pages/Chat';
import FAQ from '../pages/FAQ/FAQ';
import Info from '../pages/Info';
import TransactionsHistory from '../components/TransactionsHistory/TransactionsHistory';
import TransactionsMonthlyAnalysis from '../components/TransactionsAnalysis/TransactionsMonthlyAnalysis';
import TransactionsYearlyAnalysis from '../components/TransactionsAnalysis/TransactionsYearlyAnalysis';
import CyclicPaymentsForm from '../components/CyclicPaymentForm/CyclicPaymentForm';
import CyclicPayments from '../pages/CyclicPayments';
import Profile from '../pages/Profile/Profile';
import Loan from '../pages/Loan';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
    {
        path: '/', 
        element: <App />,
        children: [
            // public routes
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '*', element: <PageNotFound /> },
            // private routes
            { path: '/dashboard', element: <PrivateRoute children={  <Dashboard /> } /> },
            { path: '/transfer', element: <PrivateRoute children={  <Transfer /> } /> },
            { path: '/loan', element: <PrivateRoute children={ <Loan /> } /> },
            { path: '/chat', element: <PrivateRoute children={ <Chat /> } /> },
            { path: '/faq', element: <PrivateRoute children={ <FAQ /> } /> },
            { path: '/info', element: <PrivateRoute children={ <Info /> } /> },
            { path: '/transactions/history', element: <PrivateRoute children={ <TransactionsHistory /> } /> },
            { path: '/transactions/analysis/monthly', element: <PrivateRoute children={ <TransactionsMonthlyAnalysis /> } /> },
            { path: '/transactions/analysis/yearly', element: <PrivateRoute children={ <TransactionsYearlyAnalysis /> } /> },
            { path: '/create-cyclic-payment', element: <PrivateRoute children={ <CyclicPaymentsForm key="create"/> } /> },
            { path: '/edit-cyclic-payment/:id', element: <PrivateRoute children={ <CyclicPaymentsForm key="edit"/> } /> },
            { path: '/cyclic-payments', element: <PrivateRoute children={ <CyclicPayments /> } /> },
            { path: '/profile', element: <PrivateRoute children={ <Profile /> } /> }
        ],
    }
]);