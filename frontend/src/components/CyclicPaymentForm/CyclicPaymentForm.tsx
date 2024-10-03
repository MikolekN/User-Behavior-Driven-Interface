import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../Tile/Tile';
import FormInput from '../FormInput/FormInput';
import { formValidationRules } from '../utils/validationRules';
import { AuthContext } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import FormSelect from '../FormSelect/FormSelect';
import { CyclicPayment } from '../utils/types/CyclicPayment';
import "react-datepicker/dist/react-datepicker.css";
import '../../pages/Form.css';

interface CyclicPaymentFromData {
    cyclicPaymentName: string;
    recipientAccountNumber: string;
    transferTitle: string;
    amount: string;
    startDate: Date | null;
    interval: string;
}

const CyclicPaymentsForm = () => {
    const { id } = useParams();
    const [date, setDate] = useState<Date | null>(new Date(Date.now() + 86400000));
    const [cyclicPayment, setCyclicPayment] = useState<CyclicPayment>({
        id: null,
        amount: 0,
        cyclicPaymentName: "",
        interval: "",
        recipientAccountNumber: "",
        recipientName: "",
        startDate: date,
        transferTitle: ""
    });

    const [ apiError, setApiError ] = useState({isError: false, errorMessage: ""});
    const { user, getUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<CyclicPaymentFromData>({
        defaultValues: {
            recipientAccountNumber: "",
            transferTitle: "",
            amount: ""
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) return;

        if (id) {
            const fetchCyclicPaymentById = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/cyclic-payment/${id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json" 
                        },
                        credentials: "include"
                    })
                    const responseJson = await response.json();
                    if (response.ok) {
                        const parsedCyclicPayment: CyclicPayment = {
                            id: responseJson.cyclic_payment._id,
                            amount: responseJson.cyclic_payment.amount,
                            cyclicPaymentName: responseJson.cyclic_payment.cyclic_payment_name,
                            interval: responseJson.cyclic_payment.interval,
                            recipientAccountNumber: responseJson.cyclic_payment.recipient_account_number,
                            recipientName: responseJson.cyclic_payment.recipient_name,
                            transferTitle: responseJson.cyclic_payment.transfer_title,
                            startDate: responseJson.cyclic_payment.start_date ? new Date(responseJson.cyclic_payment.start_date) : null,
                        };
                        setCyclicPayment(parsedCyclicPayment);
                    }
                    else {
                        setApiError({
                            isError: true,
                            errorMessage: responseJson.message
                        });
                        throw new Error(responseJson.message);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }

            fetchCyclicPaymentById();
        }

    }, [id])

    useEffect(() => {
        setValue("cyclicPaymentName", cyclicPayment.cyclicPaymentName);
        setValue("recipientAccountNumber", cyclicPayment.recipientAccountNumber);
        setValue("transferTitle", cyclicPayment.transferTitle);
        setValue("amount", cyclicPayment.amount.toString());
        setValue("startDate", cyclicPayment.startDate);
        setValue("interval", cyclicPayment.interval);
    }, [cyclicPayment]);
    
    const onSubmit = handleSubmit(async (data: CyclicPaymentFromData) => {
        if (!cyclicPayment.id) {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/cyclic-payment", {
                    method: "POST",
                    headers: {
                       "Content-Type": "application/json" 
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        cyclicPaymentName: data.cyclicPaymentName,
                        recipientAccountNumber: data.recipientAccountNumber,
                        transferTitle: data.transferTitle,
                        amount: data.amount,
                        startDate: data.startDate?.toISOString(),
                        interval: data.interval
                    })
                })
                const responseJson = await response.json();
                if (response.ok) {
                    getUser();
                    navigate('/cyclic-payments');
                }
                else {
                    setApiError({
                        isError: true,
                        errorMessage: responseJson.message
                    });
                    console.error(apiError);
                    throw new Error(responseJson.message);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/cyclic-payment/${id}`, {
                    method: "PUT",
                    headers: {
                       "Content-Type": "application/json" 
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        cyclicPaymentName: data.cyclicPaymentName,
                        recipientAccountNumber: data.recipientAccountNumber,
                        transferTitle: data.transferTitle,
                        amount: data.amount,
                        startDate: data.startDate?.toISOString(),
                        interval: data.interval
                    })
                })
                const responseJson = await response.json();
                if (response.ok) {
                    getUser();
                    navigate('/cyclic-payments');
                }
                else {
                    setApiError({
                        isError: true,
                        errorMessage: responseJson.message
                    });
                    throw new Error(responseJson.message);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        
    });
    
    const handleChange = (dateChange: Date | null) => {
        setValue("startDate", dateChange, {
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
                                    {user?.accountName} {`(${user?.availableFunds} PLN)`}
                                </p>
                                <p>
                                    {user?.accountNumber}
                                </p>
                            </div>
                        </div>
                        <form className="space-y-6" onSubmit={onSubmit}>
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
                                defaultValue={date}
                                render={() => (
                                    <DatePicker
                                        selected={date}
                                        dateFormat={"dd/MM/yyyy"}
                                        placeholderText="Select date"
                                        onChange={handleChange}
                                        className="bg-white border-2"
                                        showIcon={true}
                                        minDate={date!}
                                    />
                                )}
                            />
                            <FormSelect 
                                label="Interval"
                                options={["select an option", "every 7 days", "every month", "every 3 months", "every 6 months"]}
                                register={register('interval', {
                                    required: formValidationRules.interval.required
                                })}
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
                                <span className="p-3 bg-gray-300 text-gray-700 border border-gray-300 border-l-0 rounded-lg mt-1 ml-1">
                                    PLN
                                </span>
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
}

export default CyclicPaymentsForm;