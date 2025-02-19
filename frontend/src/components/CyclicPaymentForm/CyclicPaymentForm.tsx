import { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../Tile/Tile';
import FormInput from '../FormInput/FormInput';
import { UserContext } from '../../context/UserContext';
import FormSelect from '../FormSelect/FormSelect';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import { zodResolver } from '@hookform/resolvers/zod';
import { CyclicPaymentFormData, CyclicPaymentFormDataSchema } from '../../schemas/formValidation/cyclicPaymentSchema';
import { DAY_LENGTH_IN_MILISECONDS, MILISECONDS_IN_ONE_MINUTE } from '../constants';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import { INTERVAL_SELECT_OPTIONS } from '../../pages/constants';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import ErrorAlert from '../Alerts/ErrorAlert';
import { scrollToTop } from '../utils/scroll';
import AccountDetails from '../utils/AccountDetails';
import { Datepicker, Flowbite } from 'flowbite-react';
import Label from '../utils/Label';
import { datepickerTheme } from '../utils/themes/datepickerTheme';
import { datepickerErrorTheme } from '../utils/themes/datepickerErrorTheme';
import ErrorMessage from '../utils/ErrorMessage';
import { useTranslation } from 'react-i18next';
import Button from '../utils/Button';
import { AccountContext } from '../../context/AccountContext';
import ActiveAccountError from '../ActiveAccountError/ActiveAccountError';

const CyclicPaymentsForm = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [ date, setDate ] = useState<Date | undefined | null>(undefined);
    const [ minDate, setMinDate ] = useState<Date | undefined | null>(new Date(Date.now() + DAY_LENGTH_IN_MILISECONDS));
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext);
    const { account } = useContext(AccountContext);
    const { cyclicPayment, setCyclicPayment, createCyclicPayment, getCyclicPayment, 
        updateCyclicPayment } = useContext(CyclicPaymentContext);

    const { register, handleSubmit, formState: { errors, isSubmitting }, clearErrors, control, setValue } = useForm<CyclicPaymentFormData>({
        resolver: zodResolver(CyclicPaymentFormDataSchema),
        defaultValues: {
            recipientAccountNumber: '',
            transferTitle: '',
            amount: ''
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();

    const setCyclicPaymentFormDefaultValues = useCallback(() => {
        setValue('cyclicPaymentName', '');
        setValue('recipientAccountNumber', '');
        setValue('transferTitle', '');
        setValue('amount', '');
        setMinDate(new Date(Date.now() + DAY_LENGTH_IN_MILISECONDS));
        setDate(null);
        setValue('interval', '');
    }, [setValue]);

    const setCyclicPaymentFormEditValues = useCallback((cyclicPayment: CyclicPayment) => {
        setValue('cyclicPaymentName', cyclicPayment.cyclicPaymentName);
        setValue('recipientAccountNumber', cyclicPayment.recipientAccountNumber);
        setValue('transferTitle', cyclicPayment.transferTitle);
        setValue('amount', cyclicPayment.amount.toString());
        setMinDate(cyclicPayment.startDate)
        setDate(cyclicPayment.startDate);
        setValue('interval', cyclicPayment.interval);
    }, [setValue]);

    useEffect(() => {
        if (!user) return;

        if (id) {
            const fetchCyclicPaymentById = async () => {
                try {
                    await getCyclicPayment(id);
                } catch (error) {
                    handleError(error);
                }
            };

            void fetchCyclicPaymentById();
        } else {
            setCyclicPayment(null);
        }

    }, [user, id, setCyclicPayment, getCyclicPayment]);

    useEffect(() => {
        if (cyclicPayment) {
            setCyclicPaymentFormEditValues(cyclicPayment);
        } else {
            setCyclicPaymentFormDefaultValues();
        }
    }, [cyclicPayment, setCyclicPaymentFormEditValues, setCyclicPaymentFormDefaultValues]);

    const toLocalISOString = (date: Date) => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * MILISECONDS_IN_ONE_MINUTE);
        return localDate.toISOString();
    };

    const getCyclicPaymentRequestBody = (data: CyclicPaymentFormData) => {
        return {
            cyclic_payment_name: data.cyclicPaymentName,
            recipient_account_number: data.recipientAccountNumber,
            transfer_title: data.transferTitle,
            amount: data.amount,
            start_date: toLocalISOString(data.startDate!),
            interval: data.interval
        };
    };

    const onSubmit: SubmitHandler<CyclicPaymentFormData> = async (data: CyclicPaymentFormData) => {
        clearApiError();
        const requestBody = getCyclicPaymentRequestBody(data);
        if (cyclicPayment === null) {
            try {
                await createCyclicPayment(requestBody);
                await getUser();
                navigate('/cyclic-payments');
            } catch (error) {
                handleError(error);
                scrollToTop('cyclic-payment-form-wrapper');
            }
        } else {
            try {
                await updateCyclicPayment(id!, requestBody);
                await getUser();
                navigate('/cyclic-payments');
            } catch (error) {
                handleError(error);
                scrollToTop('cyclic-payment-form-wrapper');
            }
        }
    };
    
    const handleDateChange = (date: Date | null) => {
        if (!date) {
            return;
        }

        clearErrors('startDate');
        setValue('startDate', date, {
            shouldDirty: true
        });
        setDate(date);
    };

    if (account === null) {
        return (
            <div id="cyclic-payment-form-wrapper" className="flex items-center justify-center">
                <ActiveAccountError />
            </div>);
    }

    return (
        <div id="cyclic-payment-form-wrapper" className="flex items-center justify-center">
            <Tile title={t('cyclicPaymentForm.tile.title')} id="cyclic-payment-form" className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        { apiError.isError && 
                            <div className="my-4">
                                <ErrorAlert alertMessage={apiError.errorMessage} />
                            </div> 
                        }
                        <AccountDetails label={t('cyclicPaymentForm.fromAccount')} account={account!} className='w-full p-3 mb-6' />
                        <form id="cyclic-payment-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <FormInput 
                                label={t('cyclicPaymentForm.cyclicPaymentName')}
                                fieldType="text"
                                register={register('cyclicPaymentName')}
                                error={errors.cyclicPaymentName}
                                className="w-full"
                            />
                            <FormInput 
                                label={t('cyclicPaymentForm.recipientAccountNumber')}
                                fieldType="text"
                                register={register('recipientAccountNumber')}
                                error={errors.recipientAccountNumber}
                                className="w-full"
                            />
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue={undefined}
                                render={() => (
                                    <div className="mb-4">
                                        <Label label={t('cyclicPaymentForm.startDate')} />
                                        {/* TODO: inne kolory border i ring, oraz dark theme */}
                                        <Flowbite theme={{ theme: errors.startDate ? datepickerErrorTheme : datepickerTheme }}>
                                            <Datepicker
                                                language={localStorage.getItem('language') || 'en'}
                                                minDate={minDate!}
                                                weekStart={1} // Monday
                                                onChange={handleDateChange}
                                                showClearButton={false}
                                                showTodayButton={false}
                                                value={date}
                                                label={t('cyclicPaymentForm.startDatePlaceholder')}
                                            />
                                        </Flowbite>
                                        {errors.startDate && (
                                            <ErrorMessage message={t(`errors.zod.${errors.startDate.message}`)}/>
                                        )}
                                    </div>
                                )}
                            />
                            <FormSelect
                                label={t('cyclicPaymentForm.transferInterval')}
                                options={INTERVAL_SELECT_OPTIONS}
                                defaultOption={t('cyclicPaymentForm.selectInterval')}
                                register={register('interval')}
                                error={errors.interval}
                                className="w-full"
                            />
                            <FormInput 
                                label={t('cyclicPaymentForm.title')}
                                fieldType="text"
                                register={register('transferTitle')}
                                error={errors.transferTitle}
                                className="w-full"
                            />
                            <FormInput 
                                label={t('cyclicPaymentForm.amount')}
                                fieldType="text"
                                register={register('amount')}
                                error={errors.amount}
                                className="w-10/12"
                            >
                                {account!.currency}
                            </FormInput>
                            <Button isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
						        {isSubmitting ? `${t('cyclicPaymentForm.loading')}` : `${t('cyclicPaymentForm.submit')}`}
                            </Button>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default CyclicPaymentsForm;