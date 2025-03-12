import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import { useTranslation } from 'react-i18next';
import Button from '../utils/Button';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import CollapsibleTable from '../CollapsibleTable/CollapsibleTable';
import Label from '../utils/Label';
import AccountDetails from '../utils/AccountDetails';
import { UserContext } from '../../context/UserContext';
import CollapsibleList from '../CollapsibleList/CollapsibleList';
import { AccountContext } from '../../context/AccountContext';

interface CyclicPaymentListProps {
    cyclicPaymentsList: CyclicPayment[];
}

const CyclicPaymentList = ({ cyclicPaymentsList }: CyclicPaymentListProps) => {
    const { t } = useTranslation();
    const { getUser } = useContext(UserContext);
    const { deleteCyclicPayment } = useContext(CyclicPaymentContext);
    const { activeAccount } = useContext(AccountContext);
    const { handleError } = useApiErrorHandler();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);

    const resetActiveIndex = () => {
        setActiveIndex(null);
    };

    useEffect(() => {
        setCyclicPayments(cyclicPaymentsList);
    }, [cyclicPaymentsList]);

    const formatDate = (creationDate: Date | null): string | null => {
        if (!creationDate) return null;
        return new Date(creationDate).toLocaleDateString();
    };

    const handleDelete = (id: string) => {
        const deleteCyclicPaymentItem = async () => {
            try {
                await deleteCyclicPayment(id);
                resetActiveIndex();
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
                    <Button className="justify-self-end mb-2 dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('cyclicPaymentList.submit')}</Button>
                </div>
            </Link>
            <div className="hidden md:block">
                <CollapsibleTable
                    headers={[
                        t('cyclicPaymentList.nameAndReceiver'),
                        t('cyclicPaymentList.amount'),
                        t('cyclicPaymentList.createdDate'),
                    ]}
                    rows={cyclicPayments}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    renderRow={(cyclicPayment, activeIndex, hovering, idx) => (
                        <>
                            <td className={`px-4 py-2 text-center font-bold rounded-tl ${activeIndex !== idx ? 'rounded-bl' : ''} ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>
                                <div>
                                    <span className="block py-1">
                                        <b>{cyclicPayment.cyclicPaymentName}</b>
                                    </span>
                                    <span className="block py-1">
                                        <i>{cyclicPayment.recipientName}</i>
                                    </span>
                                </div>
                            </td>
                            <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>{cyclicPayment.amount}</td>
                            <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>{formatDate(cyclicPayment.startDate)}</td>
                        </>
                    )}
                    renderRowDetails={(cyclicPayment) => (
                        <div className="flex flex-col items-center space-y-4 p-4 mt-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex w-full justify-evenly">
                                <div>
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.recipient')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{cyclicPayment.recipientName}</i>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.recipientAccountNumber')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{cyclicPayment.recipientAccountNumber}</i>
                                        </div>
                                    </div>
                                    <AccountDetails label={t('cyclicPaymentList.fromAccount')} account={activeAccount!} className='w-max pl-4 p-3' />
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.title')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{cyclicPayment.transferTitle}</i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.amount')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{cyclicPayment.amount} {activeAccount?.currency}</i>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.startDate')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{formatDate(cyclicPayment.startDate)}</i>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentList.transferInterval')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{t(`cyclicPaymentList.${cyclicPayment.interval}`)}</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 w-full">
                                <Link to={`/edit-cyclic-payment/${cyclicPayment.id}`} className="w-1/6">
                                    <Button className="w-full mt-1 dark:bg-slate-900 dark:hover:bg-slate-800">
                                        {t('cyclicPaymentList.edit')}
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(cyclicPayment.id!)} className="w-1/6 bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1 ml-10">
                                    {t('cyclicPaymentList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
            <div className="md:hidden">
                <CollapsibleList
                    items={cyclicPayments}
                    renderHeader={(cyclicPayment) => (
                        <span>{cyclicPayment.cyclicPaymentName}</span>
                    )}
                    renderDetails={(cyclicPayment) => (
                        <div className="flex flex-col space-y-4">
                            <div className="pr-4">
                                <div>
                                    <Label label={t('cyclicPaymentList.recipient')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{cyclicPayment.recipientName}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('cyclicPaymentList.recipientAccountNumber')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{cyclicPayment.recipientAccountNumber}</i>
                                    </div>
                                </div>
                                <AccountDetails label={t('cyclicPaymentList.fromAccount')} account={activeAccount!} className='w-fit pl-4 p-3' />
                                <div className="mb-4">
                                    <Label label={t('cyclicPaymentList.title')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{cyclicPayment.transferTitle}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('cyclicPaymentList.amount')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{cyclicPayment.amount} {activeAccount?.currency}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('cyclicPaymentList.startDate')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{formatDate(cyclicPayment.startDate)}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('cyclicPaymentList.transferInterval')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{cyclicPayment.interval}</i>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center w-full">
                                <Link to={`/edit-cyclic-payment/${cyclicPayment.id}`} className="w-5/12">
                                    <Button className="w-full mt-1 dark:bg-slate-900 dark:hover:bg-slate-800">
                                        {t('cyclicPaymentList.edit')}
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(cyclicPayment.id!)} className="w-5/12 bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1 ml-10">
                                    {t('cyclicPaymentList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default CyclicPaymentList;
