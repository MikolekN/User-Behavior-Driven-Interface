import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CyclicPayment } from "../utils/types/CyclicPayment";
import Button from "../utils/Button";
import arrowUp from "../../assets/images/chevron-up.svg";
import arrowDown from "../../assets/images/chevron-down.svg";
import '../utils/styles/common.css';

interface CyclicPaymentListProps {
    cyclicPaymentsList: CyclicPayment[];
}

const CyclicPaymentList = ({ cyclicPaymentsList }: CyclicPaymentListProps) => {
    const { user }: AuthContext = useOutletContext();
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        setCyclicPayments(cyclicPaymentsList);
    }, [cyclicPaymentsList]);
    
    const formatDate = (creationDate: Date | null): string | null => {
        if (!creationDate) {
            return null;
        }
        const month = creationDate.getUTCMonth() + 1
        const day = creationDate.getUTCDate();
        const year = creationDate.getUTCFullYear();

        const pMonth = month.toString().padStart(2,"0");
        const pDay = day.toString().padStart(2,"0");
        const date = `${pDay}.${pMonth}.${year}`;

        return date;
    }

    const handleDelete = (id: string) => {
        const deleteCyclicPayment = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/cyclic-payment/${id}`, {
                    method: "DELETE",
                    headers: {
                    "Content-Type": "application/json" 
                    },
                    credentials: "include"
                });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setActiveIndex(null);
            const data = await response.json(); // maybe use API message
            } catch (error) {
                setError(true);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        deleteCyclicPayment().then(() => {
            setCyclicPayments(cyclicPayments => cyclicPayments.filter(x => x.id !== id));
        });
    }

    return (
        <div className="grid">
            <Link to={`/create-cyclic-payment/`} className="justify-self-end pr-12 pb-4">
                <Button>+ Add Cyclic Payment</Button>
            </Link>
            <table className="table-fixed w-11/12 justify-self-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th colSpan={2}>Cyclic Payment Name / Receiver</th>
                        <th>Amount</th>
                        <th>Created Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {cyclicPayments.map((cyclicPayment, idx) => (
                    <>
                        <tr onClick={() => { toggleAnswer(idx) }}>
                            <td colSpan={2} className="px-4 py-2 text-center font-bold">
                                <div>
                                    <span className="block py-1">
                                        <b>{cyclicPayment.cyclicPaymentName}</b>
                                    </span>
                                    <span className="block py-1">
                                        <i>{cyclicPayment.recipientName}</i>
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                                {cyclicPayment.amount} {user.currency}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {formatDate(cyclicPayment.startDate)}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {activeIndex === idx ? 
                                    (
                                    <div className="grid">
                                        <img src={arrowUp} alt="Arrow Up" className="justify-self-center h-8" />
                                    </div>)
                                    : (
                                    <div className="grid">
                                        <img src={arrowDown} alt="Arrow Down" className="justify-self-center h-8" />
                                    </div>)
                                }
                            </td>
                        </tr>
                        {activeIndex === idx && (
                            <tr>
                                <td colSpan={5}>
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex justify-between">
                                            <div className="w-1/2">
                                                <span className="block py-1">
                                                    <div>
                                                        Recipient
                                                    </div> 
                                                    <div>
                                                        <i>{cyclicPayment.recipientName}</i>
                                                    </div>
                                                    <div>
                                                        Recipient Account Number
                                                    </div> 
                                                    <div>
                                                        <i>{cyclicPayment.recipientAccountNumber}</i>
                                                    </div>
                                                </span>
                                                <span className="block py-1">
                                                    <div>
                                                        From Account
                                                    </div> 
                                                    <div className="w-5/6 p-3 border border-gray-300 rounded-lg mt-1 bg-gray-200">
                                                        <p>
                                                            {user.accountName} {`(${user.availableFunds} {PLN})`}
                                                        </p>
                                                        <p>
                                                            {user.accountNumber}
                                                        </p>
                                                    </div>
                                                </span>
                                                <span className="block py-1">
                                                    <div>
                                                        Title
                                                    </div> 
                                                    <div>
                                                        <i>{cyclicPayment.transferTitle}</i>
                                                    </div>
                                                </span>
                                            </div>
                                            <div className="w-1/2">
                                                <span className="block py-1">
                                                    <div>
                                                        Amount
                                                    </div> 
                                                    <div>
                                                        <i>{cyclicPayment.amount} {user.currency}</i>
                                                    </div>
                                                </span>
                                                <span className="block py-1">
                                                    <div>
                                                        Start Date
                                                    </div> 
                                                    <div>
                                                        <i>{formatDate(cyclicPayment.startDate)}</i>
                                                    </div>
                                                </span>
                                                <span className="block py-1">
                                                    <div>
                                                        Repeat
                                                    </div> 
                                                    <div>
                                                        <i>{cyclicPayment.interval}</i>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/edit-cyclic-payment/${cyclicPayment.id}`} className="w-1/6">
                                                <Button className="w-full mt-1">Edit</Button>
                                            </Link>
                                            <Button onClick={() => handleDelete(cyclicPayment.id!)} 
                                                className="w-1/6 bg-red-600 hover:bg-red-700 focus:ring-red-500 mt-1">
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default CyclicPaymentList;