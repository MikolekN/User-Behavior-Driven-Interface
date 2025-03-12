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
import TransactionsHistory from '../pages/TransactionsHistory/TransactionsHistory';
import TransactionsMonthlyAnalysis from '../pages/TransactionsAnalysisMonthly/TransactionsMonthlyAnalysis';
import TransactionsYearlyAnalysis from '../pages/TransactionsAnalysisYearly/TransactionsYearlyAnalysis';
import CyclicPaymentsForm from '../pages/CyclicPayment/CyclicPaymentForm';
import CyclicPayments from '../pages/CyclicPayments/CyclicPayments';
import Profile from '../pages/Profile/Profile';
import Loan from '../pages/Loan/Loan';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PrivateRoute from './PrivateRoute';
import Accounts from '../pages/Accounts/Accounts';
import AccountForm from '../pages/Account/AccountForm';
import Cards from '../pages/Cards/Cards';
import CardForm from '../pages/Card/CardForm';


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
                    { path: '/edit-account/:accountNumber', element: <AccountForm key="edit" />},
                    { path: '/cards', element: <Cards /> },
                    { path: 'create-card', element: <CardForm key="create" /> },
                    { path: 'edit-card/:cardNumber', element: <CardForm key="edit" /> }
                ]
            },
        ],
    }
]);
