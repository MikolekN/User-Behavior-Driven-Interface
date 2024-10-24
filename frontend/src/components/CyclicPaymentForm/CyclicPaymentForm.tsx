import { useCallback, useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../Tile/Tile';
import FormInput from '../FormInput/FormInput';
import { formValidationRules } from '../utils/validationRules';
import { UserContext } from '../../context/UserContext';
import DatePicker from 'react-datepicker';
import FormSelect from '../FormSelect/FormSelect';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import 'react-datepicker/dist/react-datepicker.css';
import '../../pages/Form.css';
import { DAY_LENGTH_IN_MILISECONDS } from '../constants';
import { CyclicPaymentContext } from '../../context/CyclicPaymentContext';
import { intervalOptions } from './CyclicPaymentData';

interface CyclicPaymentFormData {
    cyclicPaymentName: string;
    recipientAccountNumber: string;
    transferTitle: string;
    amount: string;
    startDate: Date | null;
    interval: string;
}

const CyclicPaymentsForm = () => {
    const { id } = useParams();
    const [date, setDate] = useState<Date | null>(new Date(Date.now() + DAY_LENGTH_IN_MILISECONDS));
    const [minDate, ] = useState<Date | null>(new Date(Date.now() + DAY_LENGTH_IN_MILISECONDS));
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { user, getUser } = useContext(UserContext);
    const { cyclicPayment, setCyclicPayment, createCyclicPayment, getCyclicPayment, 
        updateCyclicPayment } = useContext(CyclicPaymentContext);
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<CyclicPaymentFormData>({
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
        setDate(minDate);
        setValue('interval', '');
    }, [minDate, setValue]);

    const setCyclicPaymentFormEditValues = useCallback((cyclicPayment: CyclicPayment) => {
        setValue('cyclicPaymentName', cyclicPayment.cyclicPaymentName);
        setValue('recipientAccountNumber', cyclicPayment.recipientAccountNumber);
        setValue('transferTitle', cyclicPayment.transferTitle);
        setValue('amount', cyclicPayment.amount.toString());
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
                    setApiError({
                        isError: true,
                        errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                    });
                }
            };

            void fetchCyclicPaymentById();
        } else {
            setCyclicPayment(null);
        }

    }, [user, id, setCyclicPayment, getCyclicPayment, setCyclicPaymentFormDefaultValues]);

    useEffect(() => {
        if (cyclicPayment) {
            setCyclicPaymentFormEditValues(cyclicPayment);
        } else {
            setCyclicPaymentFormDefaultValues();
        }
    }, [cyclicPayment, setCyclicPaymentFormEditValues, setCyclicPaymentFormDefaultValues]);

    const onSubmit = handleSubmit(async (data: CyclicPaymentFormData) => {
        if (cyclicPayment === null) {
            try {
                const requestBody = {
                    cyclicPaymentName: data.cyclicPaymentName,
                    recipientAccountNumber: data.recipientAccountNumber,
                    transferTitle: data.transferTitle,
                    amount: data.amount,
                    startDate: data.startDate?.toISOString(),
                    interval: data.interval
                };
                await createCyclicPayment(requestBody);
                await getUser();
                navigate('/dashboard');
            } catch (error) {
                setApiError({
                    isError: true,
                    errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                });
            }
        } else {
            try {
                const requestBody = {
                    cyclicPaymentName: data.cyclicPaymentName,
                    recipientAccountNumber: data.recipientAccountNumber,
                    transferTitle: data.transferTitle,
                    amount: data.amount,
                    startDate: data.startDate?.toISOString(),
                    interval: data.interval
                };
                await updateCyclicPayment(id!, requestBody);
                await getUser();
                navigate('/dashboard');
            } catch (error) {
                setApiError({
                    isError: true,
                    errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
                });
            }
        }
        
    });
    
    const handleChange = (dateChange: Date | null) => {
        setValue('startDate', dateChange, {
            shouldDirty: true
        });
        setDate(dateChange);
    };

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transfer" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mt-8">
                            <label className="text-sm font-semibold text-gray-700 block">From account</label>
                            <div className="w-full p-3 mb-6 border border-gray-300 rounded-lg mt-1 bg-gray-300">
                                <p>
                                    {user?.accountName} {`(${user?.availableFunds} ${user?.currency})`}
                                </p>
                                <p>
                                    {user?.accountNumber}
                                </p>
                            </div>
                        </div>
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput 
                                label="Cyclic Payment name"
                                fieldType="text"
                                register={register('cyclicPaymentName', {
                                    required: formValidationRules.cyclicPaymentName.required
                                })}
                                error={errors.cyclicPaymentName}
                                className="w-full"
                            />
                            <FormInput 
                                label="Recipient account number"
                                fieldType="text"
                                register={register('recipientAccountNumber', {
                                    required: formValidationRules.recipientAccountNumber.required,
                                    pattern: formValidationRules.recipientAccountNumber.pattern
                                })}
                                error={errors.recipientAccountNumber}
                                className="w-full"
                            />
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue={minDate}
                                render={() => (
                                    <DatePicker
                                        selected={date}
                                        dateFormat={'dd/MM/yyyy'}
                                        placeholderText="Select date"
                                        onChange={handleChange}
                                        className="bg-white border-2"
                                        showIcon={true}
                                        minDate={minDate!}
                                    />
                                )}
                            />
                            <FormSelect
                                label="Interval"
                                options={intervalOptions}
                                register={register('interval', { required: formValidationRules.interval.required })}
                                error={errors.interval}
                                className="w-full"
                            />
                            <FormInput 
                                label="Title"
                                fieldType="text"
                                register={register('transferTitle', {
                                    required: formValidationRules.transferTitle.required
                                })}
                                error={errors.transferTitle}
                                className="w-full"
                            />
                            <FormInput 
                                label="Amount"
                                fieldType="text"
                                register={register('amount', {
                                    required: formValidationRules.amount.required,
                                    pattern: formValidationRules.amount.pattern
                                })}
                                error={errors.amount}
                                className="w-10/12"
                            >
                                {user?.currency}
                            </FormInput>
                            <div>
                                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
                            </div>
                            <div>
                                {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default CyclicPaymentsForm;