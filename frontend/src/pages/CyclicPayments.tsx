import { useContext, useEffect } from 'react';
import CyclicPaymentList from '../components/CyclicPaymentList/CyclicPaymentList';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import Button from '../components/utils/Button';
import EmptyResponseInfoAlert from '../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import './CyclicPayments.css';
import { CyclicPaymentContext } from '../context/CyclicPaymentContext';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import { useTranslation } from 'react-i18next';

const CyclicPayments = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { apiError, handleError } = useApiErrorHandler();
    const { cyclicPayments, getCyclicPayments } = useContext(CyclicPaymentContext);

    useEffect(() => {
        if (!user) return;
        
        const fetchCyclicPayments = async () => {
            try {
                await getCyclicPayments();
            } catch (error) {
                handleError(error);
            }
        };

        void fetchCyclicPayments();
    }, [user, getCyclicPayments]);
    
    if (apiError.isError) {
        return (
            <EmptyResponseInfoAlert
                title={t('cyclicPaymentList.tile.title')}
                alertTitle={t('cyclicPaymentList.emptyList')}
                alertMessage={apiError.errorMessage}
            >
                <Link to={'/create-cyclic-payment/'} className="justify-self-end p-2">
                    <Button>+ {t('cyclicPaymentList.submit')}</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    }

    return (
        <div id='cyclic-payments-wrapper' className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={t('cyclicPaymentList.tile.title')} className='cyclic-payments-tile'>
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