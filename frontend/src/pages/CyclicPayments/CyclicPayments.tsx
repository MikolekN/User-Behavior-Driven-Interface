import { useContext, useEffect, useState } from 'react';
import CyclicPaymentList from '../../components/CyclicPaymentList/CyclicPaymentList';
import { UserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import Button from '../../components/utils/Button';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';
import DefaultLoadingSkeleton from '../../components/Loading/DefaultLoadingSkeleton';

const CyclicPayments = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { apiError, handleError } = useApiErrorHandler();
    const [ loading, setLoading ] = useState(true);
    const { cyclicPayments, getCyclicPayments } = useContext(CyclicPaymentContext);

    useEffect(() => {
        if (!user) return;
        
        const fetchCyclicPayments = async () => {
            try {
                await getCyclicPayments();
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchCyclicPayments();
    }, [user, getCyclicPayments]);

    if (loading) return <DefaultLoadingSkeleton />;
    
    if (apiError.isError) {
        return (
            <EmptyResponseInfoAlert
                title={t('cyclicPaymentList.tile.title')}
                alertTitle={t('cyclicPaymentList.emptyList')}
                alertMessage={apiError.errorMessage}
            >
                <Link to={'/create-cyclic-payment/'} className="justify-self-end p-2">
                    <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('cyclicPaymentList.submit')}</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    }

    return (
        <div id='cyclic-payments-wrapper' className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={t('cyclicPaymentList.tile.title')} className='flex flex-col w-10/12 shadow-md h-[95%] max-h-[95%] mb-2.5 mx-auto rounded-lg md:w-1/2'>
                <div className="flex flex-col gap-4 overflow-y-auto p-2.5">
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