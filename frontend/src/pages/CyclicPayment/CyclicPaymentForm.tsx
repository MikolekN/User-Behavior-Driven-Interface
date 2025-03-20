import { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import { UserContext } from '../../context/UserContext';
import FormSelect from '../../components/FormSelect/FormSelect';
import { CyclicPayment } from '../../components/utils/types/CyclicPayment';
import { zodResolver } from '@hookform/resolvers/zod';
import { CyclicPaymentFormData, CyclicPaymentFormDataSchema } from '../../schemas/formValidation/cyclicPaymentSchema';
import { DAY_LENGTH_IN_MILISECONDS, MILISECONDS_IN_ONE_MINUTE } from '../../components/constants';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import { INTERVAL_SELECT_OPTIONS } from '../constants';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import { scrollToTop } from '../../components/utils/scroll';
import AccountDetails from '../../components/utils/AccountDetails';
import { Datepicker, Flowbite } from 'flowbite-react';
import Label from '../../components/utils/Label';
import { datepickerTheme } from '../../components/utils/themes/datepickerTheme';
import { datepickerErrorTheme } from '../../components/utils/themes/datepickerErrorTheme';
import ErrorMessage from '../../components/utils/ErrorMessage';
import { useTranslation } from 'react-i18next';
import Button from '../../components/utils/Button';
import { AccountContext } from '../../context/AccountContext';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';
import { SUBMIT_BUTTONS } from '../../event/utils/constants';

const CyclicPaymentsForm = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [ date, setDate ] = useState<Date | undefined | null>(undefined);
    const [ minDate, setMinDate ] = useState<Date | undefined | null>(new Date(Date.now() + DAY_LENGTH_IN_MILISECONDS));
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext);
    const { activeAccount } = useContext(AccountContext);
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
    }, []);

    const setCyclicPaymentFormEditValues = useCallback((cyclicPayment: CyclicPayment) => {
        setValue('cyclicPaymentName', cyclicPayment.cyclicPaymentName);
        setValue('recipientAccountNumber', cyclicPayment.recipientAccountNumber);
        setValue('transferTitle', cyclicPayment.transferTitle);
        setValue('amount', cyclicPayment.amount.toString());
        setMinDate(cyclicPayment.startDate);
        setDate(cyclicPayment.startDate);
        setValue('interval', cyclicPayment.interval);
    }, []);

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
                navigate('/dashboard');
            } catch (error) {
                handleError(error);
                scrollToTop();
            }
        } else {
            try {
                await updateCyclicPayment(id!, requestBody);
                await getUser();
                navigate('/dashboard');
            } catch (error) {
                handleError(error);
                scrollToTop();
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

    if (activeAccount === null) {
        return (
            <div id="cyclic-payment-form-wrapper" className="flex items-center justify-center">
                <ActiveAccountError />
            </div>);
    }

    return (
        <Tile id="cyclic-payment-form" title={t('cyclicPaymentForm.tile.title')}>
            <div id="form-error-alert">
                { apiError.isError &&
                    <ErrorAlert alertMessage={apiError.errorMessage} />
                }
            </div>
            <AccountDetails label={t('cyclicPaymentForm.fromAccount')} account={activeAccount!} className='w-full p-3 mb-3' />
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
                                    defaultValue={date!}
                                    value={date!}
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
                    {activeAccount!.currency}
                </FormInput>
                <Button id={SUBMIT_BUTTONS.CYCLIC_PAYMENT.id} isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                    {isSubmitting
                        ? t('cyclicPaymentForm.loading')
                        : id
                            ? t('cyclicPaymentForm.edit')
                            : t('cyclicPaymentForm.submit')
                    }
                </Button>
            </form>
        </Tile>
    );
};

export default CyclicPaymentsForm;
