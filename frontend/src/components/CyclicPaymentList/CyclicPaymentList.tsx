import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CyclicPayment } from "../utils/types/CyclicPayment";
import Button from "../utils/Button";
import arrowUp from "../../assets/images/chevron-up.svg";
import arrowDown from "../../assets/images/chevron-down.svg";
import '../utils/styles/table.css';

interface CyclicPaymentListProps {
    cyclicPaymentsList: CyclicPayment[];
}

const CyclicPaymentList = ({ cyclicPaymentsList }: CyclicPaymentListProps) => {
    const { user } = useContext(AuthContext);
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
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        deleteCyclicPayment().then(() => {
            setCyclicPayments(cyclicPayments => cyclicPayments.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <Link to={`/create-cyclic-payment/`} className="pr-12 pb-4">
                <div className="grid">
                    <Button className="justify-self-end mb-2">
                        + Add Cyclic Payment
                    </Button>
                </div>
            </Link>
            <table className="table-fixed w-11/12 justify-self-center">
                <thead className="bg-gray-200">
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
                        <tr onClick={() => { toggleAnswer(idx) }} style={activeIndex === idx ? {"background": "#f2f2f2"} : {}}>
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
                                {cyclicPayment.amount} {user?.currency}
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
                                    <div className="flex flex-col items-center space-y-4 p-4 my-2 border border-gray-300 rounded-lg">
                                        <div className="flex w-5/6 justify-evenly">
                                            <div className="w-2/4 pr-4">
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        Recipient
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{cyclicPayment.recipientName}</i>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-semibold mt-2">
                                                        Recipient Account Number
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{cyclicPayment.recipientAccountNumber}</i>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        From Account
                                                    </div>
                                                    <div className="pl-4 p-3 border border-gray-300 rounded-lg bg-gray-100">
                                                        <p>{user?.accountName} ({user?.availableFunds} {user?.currency})</p>
                                                        <p>{user?.accountNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        Title
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{cyclicPayment.transferTitle}</i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-1/4 pl-4">
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        Amount
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{cyclicPayment.amount} {user?.currency}</i>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        Start Date
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{formatDate(cyclicPayment.startDate)}</i>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="font-semibold">
                                                        Repeat
                                                    </div>
                                                    <div className="pl-4">
                                                        <i>{cyclicPayment.interval}</i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-4 w-full">
                                            <Link to={`/edit-cyclic-payment/${cyclicPayment.id}`} className="w-1/6">
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-1">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button onClick={() => handleDelete(cyclicPayment.id!)}
                                                className="w-1/6 bg-red-600 hover:bg-red-700 mt-1 ml-10">
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