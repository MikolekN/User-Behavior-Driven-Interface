import { useContext, useEffect, useState } from 'react';
import CyclicPaymentList from '../components/CyclicPaymentList/CyclicPaymentList';
import { UserContext } from '../context/UserContext';
import { Link, Navigate } from 'react-router-dom';
import { BackendCyclicPayment } from '../components/utils/types/CyclicPayment';
import Tile from '../components/Tile/Tile';
import Button from '../components/utils/Button';
import EmptyResponseInfoAlert from '../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import './CyclicPayments.css';
import { CyclicPaymentContext } from '../context/CyclicPaymentContext';

export interface CyclicPaymentResponse {
    cyclic_payments: BackendCyclicPayment[];
}

const CyclicPayments = () => {
    const { user } = useContext(UserContext);
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { cyclicPayments, getCyclicPayments } = useContext(CyclicPaymentContext);

    useEffect(() => {
        if (!user) return;
        
        const fetchCyclicPayments = async () => {
            try {
                await getCyclicPayments();
            } catch (error) {
                setApiError({
                    isError: true,
                    errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                });
            }
        };

        void fetchCyclicPayments();
    }, [user, getCyclicPayments]);

    if (!user) return <Navigate to="/login" />;
    
    if (apiError.isError) { 
        return (
            <EmptyResponseInfoAlert
                title="Cyclic Payments List"
                alertTitle="No transactions history to generate analysis yet"
                alertMessage={apiError.errorMessage}
            >
                <Link to={'/create-cyclic-payment/'} className="justify-self-end p-2">
                    <Button>+ Add Cyclic Payment</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    }

    return (
        <div className='cyclic-payments-wrapper'>
            <Tile title="Cyclic Payments List" className='cyclic-payments-tile'>
                <div className="cyclic-payments-container">
                    {!cyclicPayments && (
                        <div>Cyclic Payments are loading...</div>
                    )}
                    {cyclicPayments && cyclicPayments.length > 0 && (
                    <CyclicPaymentList cyclicPaymentsList={cyclicPayments}/>
                    )}
                </div>
            </Tile>
        </div>
    );
};

export default CyclicPayments;