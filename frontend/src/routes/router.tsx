import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Transfer from '../pages/Transfer/Transfer';
import Chat from '../pages/Chat/Chat';
import FAQ from '../pages/FAQ/FAQ';
import Info from '../pages/Info/Info';
import TransactionsHistory from '../components/TransactionsHistory/TransactionsHistory';
import TransactionsMonthlyAnalysis from '../components/TransactionsAnalysis/TransactionsMonthlyAnalysis';
import TransactionsYearlyAnalysis from '../components/TransactionsAnalysis/TransactionsYearlyAnalysis';
import CyclicPaymentsForm from '../components/CyclicPaymentForm/CyclicPaymentForm';
import CyclicPayments from '../pages/CyclicPayments/CyclicPayments';
import Profile from '../pages/Profile/Profile';
import Loan from '../pages/Loan/Loan';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PrivateRoute from './PrivateRoute';
import Accounts from '../pages/Accounts/Accounts';
import AccountForm from '../components/AccountForm/AccountForm';

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
            {
                element: <PrivateRoute />,
                children: [
                    { path: '/dashboard', element: <Dashboard /> },
                    { path: '/transfer', element: <Transfer /> },
                    { path: '/loan', element: <Loan /> },
                    { path: '/chat', element: <Chat /> },
                    { path: '/faq', element: <FAQ /> },
                    { path: '/info', element: <Info /> },
                    { path: '/transactions/history', element: <TransactionsHistory /> },
                    { path: '/transactions/analysis/monthly', element: <TransactionsMonthlyAnalysis /> },
                    { path: '/transactions/analysis/yearly', element: <TransactionsYearlyAnalysis /> },
                    { path: '/create-cyclic-payment', element: <CyclicPaymentsForm key="create" /> },
                    { path: '/edit-cyclic-payment/:id', element: <CyclicPaymentsForm key="edit" /> },
                    { path: '/cyclic-payments', element: <CyclicPayments /> },
                    { path: '/profile', element: <Profile /> },
                    { path: '/accounts', element: <Accounts /> },
                    { path: '/create-account', element: <AccountForm key="create" />},
                    { path: '/edit-account/:accountNumber', element: <AccountForm key="edit" />}
                ]
            },
        ],
    }
]);