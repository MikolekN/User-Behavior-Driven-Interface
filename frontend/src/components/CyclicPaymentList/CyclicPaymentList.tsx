import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import Button from '../utils/Button';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import '../utils/styles/table.css';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';

interface CyclicPaymentListProps {
    cyclicPaymentsList: CyclicPayment[];
}

const CyclicPaymentList = ({ cyclicPaymentsList }: CyclicPaymentListProps) => {
    const { user, getUser } = useContext(UserContext);
    const { deleteCyclicPayment } = useContext(CyclicPaymentContext);
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });

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
        const month = creationDate.getUTCMonth() + 1;
        const day = creationDate.getUTCDate();
        const year = creationDate.getUTCFullYear();

        const pMonth = month.toString().padStart(2, '0');
        const pDay = day.toString().padStart(2, '0');
        const date = `${pDay}.${pMonth}.${year}`;

        return date;
    };

    const handleDelete = (id: string) => {
        const deleteCyclicPaymentItem = async () => {
            try {
                await deleteCyclicPayment(id);
                setActiveIndex(null);
                await getUser();
            } catch (error) {
                setApiError({
                    isError: true,
                    errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                });
            }
        };

        void deleteCyclicPaymentItem().then(() => {
            setCyclicPayments(cyclicPayments => cyclicPayments.filter(x => x.id !== id));
        });
    };

    return (
        <div>
            <Link to={'/create-cyclic-payment/'} className="pr-12 pb-4">
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
                            <tr onClick={() => { toggleAnswer(idx); }} style={activeIndex === idx ? { 'background': '#f2f2f2' } : {}}>
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
                                                    <Button className="w-full mt-1">
                                                    Edit
                                                    </Button>
                                                </Link>
                                                <Button onClick={() => handleDelete(cyclicPayment.id!)}
                                                    className="w-1/6 bg-red-600 hover:bg-red-700 mt-1 ml-10">
                                                    Delete
                                                </Button>
                                            </div>
                                            <div>
                                                {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
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
    );
};

export default CyclicPaymentList;