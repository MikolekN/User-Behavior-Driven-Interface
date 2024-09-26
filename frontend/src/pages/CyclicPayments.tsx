import { useEffect, useState } from "react";
import CyclicPaymentList from '../components/CyclicPaymentList/CyclicPaymentList';
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate, useOutletContext } from "react-router-dom";
import { BackendCyclicPayment, CyclicPayment } from "../components/utils/types/CyclicPayment";
import Tile from "../components/Tile/Tile";
import Button from "../components/utils/Button";
import '../components/utils/styles/common.css';

const CyclicPayments = () => {
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user }: AuthContext = useOutletContext();

    useEffect(() => {
        const fetchCyclicPayments = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/cyclic-payments', {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json" 
                    },
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
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
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCyclicPayments();
    }, []);

    if (!user) return <Navigate to="/login" />

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
                {cyclicPayments && !cyclicPayments.length &&
                    <div className="grid">
                        <div className="p-4">
                            No Cyclic Payments To Display
                        </div>
                        <Link to={`/create-cyclic-payment/`} className="justify-self-center">
                            <Button>+ Add Cyclic Payment</Button>
                        </Link>
                    </div>
                }
                {cyclicPayments && cyclicPayments.length > 0 &&
                    <CyclicPaymentList cyclicPaymentsList={cyclicPayments}/>
                }
            </div>
        </Tile>
    )
};

export default CyclicPayments;