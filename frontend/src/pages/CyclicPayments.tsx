import { useContext, useEffect, useState } from 'react';
import CyclicPaymentList from '../components/CyclicPaymentList/CyclicPaymentList';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { BackendCyclicPayment, CyclicPayment } from '../components/utils/types/CyclicPayment';
import Tile from '../components/Tile/Tile';
import Button from '../components/utils/Button';
import '../components/utils/styles/table.css';
import EmptyResponseInfoAlert from '../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';

export interface CyclicPaymentResponse {
    cyclic_payments: BackendCyclicPayment[];
}

const CyclicPayments = () => {
    const { user } = useContext(AuthContext);
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        const fetchCyclicPayments = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/cyclic-payments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json() as CyclicPaymentResponse;
                const formattedCyclicPayments: CyclicPayment[] = [];
                data.cyclic_payments.forEach((cyclicPayment: BackendCyclicPayment) => {
                    const parsedCyclicPayment: CyclicPayment = {
                        id: cyclicPayment._id,
                        amount: cyclicPayment.amount,
                        cyclicPaymentName: cyclicPayment.cyclic_payment_name,
                        interval: cyclicPayment.interval,
                        recipientAccountNumber: cyclicPayment.recipient_account_number,
                        recipientName: cyclicPayment.recipient_name,
                        transferTitle: cyclicPayment.transfer_title,
                        startDate: cyclicPayment.start_date ? new Date(cyclicPayment.start_date) : null,
                    };
                    formattedCyclicPayments.push(parsedCyclicPayment);
                });
                setCyclicPayments(formattedCyclicPayments);
            } catch (error) {
                setError(true);
                console.error(error);
            }
        };

        void fetchCyclicPayments();
    }, [user]);

    if (!user) return <Navigate to="/login" />;
    
    if (error) { 
        return (
            <EmptyResponseInfoAlert
                title="Cyclic Payments List"
                alertTitle="No transactions history to generate analysis yet"
                alertMessage="transactions to display in transactions yearly analysis"
            >
                <Link to={'/create-cyclic-payment/'} className="justify-self-end p-2">
                    <Button>+ Add Cyclic Payment</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    }

    return (
        <Tile title="Cyclic Payments List" className="table-tile">
            <div className="flex justify-center p-8">
                {!cyclicPayments &&
                    <tr>
                        <td colSpan={5} className="text-center">
                            <div>
                                Cyclic Payments are loading
                            </div>
                        </td>
                    </tr>
                }
                {cyclicPayments && cyclicPayments.length > 0 &&
                    <CyclicPaymentList cyclicPaymentsList={cyclicPayments}/>
                }
            </div>
        </Tile>
    );
};

export default CyclicPayments;