import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import Button from '../utils/Button';
import arrowUp from '../../assets/images/chevron-up.svg';
import arrowDown from '../../assets/images/chevron-down.svg';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import Label from '../utils/Label';
import AccountDetails from '../utils/AccountDetails';
import { useTranslation } from 'react-i18next';

interface CyclicPaymentListProps {
    cyclicPaymentsList: CyclicPayment[];
}

const CyclicPaymentList = ({ cyclicPaymentsList }: CyclicPaymentListProps) => {
    const { t } = useTranslation();
    const { user, getUser } = useContext(UserContext);
    const { deleteCyclicPayment } = useContext(CyclicPaymentContext);
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hovering, setHovering] = useState<number | null>(null);
    const { apiError, handleError } = useApiErrorHandler();

    const toggleActiveTableRow = (index: number) => {
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
                handleError(error);
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
                        + {t('cyclicPaymentList.submit')}
                    </Button>
                </div>
            </Link>
            <div className="w-full border-collapse bg-[#f8f9fa] rounded p-2">
                <table className='w-full'>
                    <thead>
                        <tr className="font-bold text-center">
                            <th className="bg-[#dee2e6] px-4 py-2 rounded-tl-lg rounded-bl-lg">{t('cyclicPaymentList.nameAndReceiver')}</th>
                            <th className="bg-[#dee2e6] px-4 py-2">{t('cyclicPaymentList.amount')}</th>
                            <th className="bg-[#dee2e6] px-4 py-2">{t('cyclicPaymentList.createdDate')}</th>
                            <th className="bg-[#dee2e6] px-4 py-2 rounded-tr-lg rounded-br-lg"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cyclicPayments.map((cyclicPayment, idx) => (
                            <>
                                <tr className='h-2'></tr>
                                <tr
                                    onClick={() => toggleActiveTableRow(idx)}
                                    className={'cursor-pointer'}
                                    onMouseOver={() => setHovering(idx)}
                                    onMouseLeave={() => setHovering(null)}
                                >
                                    <td className={`px-4 py-2 text-center font-bold rounded-tl ${activeIndex !== idx ? 'rounded-bl' : ''} ${hovering === idx && activeIndex !== idx ? 'bg-gray-100' : 'bg-white'}`}>
                                        <div>
                                            <span className="block py-1"><b>{cyclicPayment.cyclicPaymentName}</b></span>
                                            <span className="block py-1"><i>{cyclicPayment.recipientName}</i></span>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100' : 'bg-white'}`}>{cyclicPayment.amount} {user?.currency}</td>
                                    <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100' : 'bg-white'}`}>{formatDate(cyclicPayment.startDate)}</td>
                                    <td className={`px-4 py-2 text-center rounded-tr ${activeIndex !== idx ? 'rounded-br' : ''}  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100' : 'bg-white'}`}>
                                        <img
                                            src={activeIndex === idx ? arrowUp : arrowDown}
                                            alt={activeIndex === idx ? 'Arrow Up' : 'Arrow Down'}
                                            className="h-8 mx-auto"
                                        />
                                    </td>
                                </tr>
                                {activeIndex === idx && (
                                    <tr className={`${activeIndex === idx ? 'expanded' : 'hidden'}`}>
                                        <td colSpan={4} className='bg-white rounded-b-lg'>
                                            <div className="flex flex-col items-center space-y-4 p-4 mt-2 border border-gray-300 rounded-lg">
                                                <div className="flex w-full justify-evenly">
                                                    <div className="w-2/4 pr-4">
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.recipient')}/>
                                                            <div className="pl-4">
                                                                <i>{cyclicPayment.recipientName}</i>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.recipientAccountNumber')}/>
                                                            <div className="pl-4">
                                                                <i>{cyclicPayment.recipientAccountNumber}</i>
                                                            </div>
                                                        </div>
                                                        <AccountDetails label={t('cyclicPaymentList.fromAccount')} user={user!} className='w-max pl-4 p-3' />
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.title')}/>
                                                            <div className="pl-4">
                                                                <i>{cyclicPayment.transferTitle}</i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/4 pl-4">
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.amount')}/>
                                                            <div className="pl-4">
                                                                <i>{cyclicPayment.amount} {user?.currency}</i>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.startDate')}/>
                                                            <div className="pl-4">
                                                                <i>{formatDate(cyclicPayment.startDate)}</i>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label label={t('cyclicPaymentList.transferInterval')}/>
                                                            <div className="pl-4">
                                                                <i>{cyclicPayment.interval}</i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-4 w-full">
                                                    <Link to={`/edit-cyclic-payment/${cyclicPayment.id}`} className="w-1/6">
                                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-1">
                                                            {t('cyclicPaymentList.edit')}
                                                        </Button>
                                                    </Link>
                                                    <Button onClick={() => handleDelete(cyclicPayment.id!)} className="w-1/6 bg-red-600 hover:bg-red-700 mt-1 ml-10">
                                                        {t('cyclicPaymentList.delete')}
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
        </div>
    );
};

export default CyclicPaymentList;