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
import Profile from '../pages/Profile';
import Loan from '../pages/Loan';

export const router = createBrowserRouter([
    {
        path: '/', 
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '/transfer', element: <Transfer /> },
            { path: '/loan', element: <Loan /> },
            { path: '/chat', element: <Chat /> },
            { path: '/faq', element: <FAQ /> },
            { path: '/info', element: <Info /> },
            { path: '/transactions/history', element: <TransactionsHistory /> },
            { path: '/transactions/analysis/monthly', element: <TransactionsMonthlyAnalysis /> },
            { path: '/transactions/analysis/yearly', element: <TransactionsYearlyAnalysis /> },
            { path: '/create-cyclic-payment', element: <CyclicPaymentsForm key="create"/> },
            { path: '/edit-cyclic-payment/:id', element: <CyclicPaymentsForm key="edit"/> },
            { path: '/cyclic-payments', element: <CyclicPayments /> },
            { path: '/profile', element: <Profile /> },
            { path: '*', element: <div>404 NOT FOUND</div> }
        ],
    }
]);