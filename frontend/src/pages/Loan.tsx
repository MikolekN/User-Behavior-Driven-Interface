import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import { AuthContext } from '../context/AuthContext';
import { isErrorResponse } from '../components/utils/types/ErrorResponse';
import Slider from '@mui/material/Slider';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanFormData, LoanFormDataSchema } from '../schemas/loanSchema';

const Loan = () => {
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { user, getUser } = useContext(AuthContext);
    const [ sliderValue, setSliderValue ] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoanFormData>({
        resolver: zodResolver(LoanFormDataSchema),
        defaultValues: {
            amount: '1000'
        },
        mode: 'onChange'
    });
    const navigate = useNavigate();

    const inputAmount = watch('amount');

    useEffect(() => {
        if (!user) return;

        if (!Number.isNaN(inputAmount)) {
            setSliderValue(parseInt(inputAmount, 10));
        }
    }, [user, inputAmount]);

    if (!user) return <Navigate to="/login" />;  

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    const onSubmit = handleSubmit(async ({ amount }: LoanFormData) => {
        console.log(amount)
        try {
            const response = await fetch('http://127.0.0.1:5000/api/transfer/loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    recipientAccountNumber: user.accountNumber,
                    transferTitle: 'Pożyczka gotówkowa',
                    amount: amount
                })
            });

            const responseJson: unknown = await response.json();

            if (response.ok) {
                await getUser();
                navigate('/dashboard');
            } else {
                if (isErrorResponse(responseJson)) {
                    setApiError({
                        isError: true,
                        errorMessage: responseJson.message
                    });
                    throw new Error(responseJson.message);
                } else {
                    throw new Error('Unexpected error format');
                }
            }
        } catch (error) {
            console.error(error);
        }
    });

    const availableLoanLengths = [
        { loanLength: 6 },
        { loanLength: 12 },
        { loanLength: 24 },
        { loanLength: 36 },
        { loanLength: 48 }
    ];

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const sliderVal = newValue as number; 
        setSliderValue(sliderVal);
        setValue('amount', sliderVal.toString());
    };

    return (
        <div className="flex items-center justify-center">
            <Tile title="Loan" className="form-tile w-2/5  bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto px-1">
                        <div className="mt-8">
                            <label className="text-sm font-semibold text-gray-700 block">From account</label>
                            <div className="w-full p-3 mb-6 border border-gray-300 rounded-lg mt-1 bg-gray-300">
                                <p>
                                    {user.accountName} {`(${user.availableFunds} ${user.currency})`}
                                </p>
                                <p>
                                    {user.accountNumber}
                                </p>
                            </div>
                        </div>
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput
                                label="How much money do you need?"
                                fieldType="text"
                                register={register('amount')}
                                error={errors.amount}
                                className="w-10/12"
                            >
                                {user.currency}
                            </FormInput>
                            <div>
                                <Slider
                                    value={sliderValue as number}
                                    onChange={handleSliderChange}
                                    aria-label="input-slider"
                                    min={1000}
                                    step={1000}
                                    max={100000}
                                    valueLabelDisplay="auto"
                                />
                                <div className="flex justify-between">
                                    <label className="text-sm font-semibold text-gray-700 block">1 000</label>
                                    <label className="text-sm font-semibold text-gray-700 block">100 000</label>
                                </div>
                            </div>
                            <div className="mt-8">
                                <label className="text-sm font-semibold text-gray-700 block text-center">Number of installments</label>
                                <div className="flex justify-between mt-4">
                                    {availableLoanLengths.map((item, idx) => (
                                        <div onClick={() => { toggleAnswer(idx); }} style={activeIndex === idx ? { 'background': '#60a5fa' } : {}} key={idx} className="border-2 border-blue-600 border-opacity-20 rounded-lg px-4 py-2">
                                            <label className="text-sm font-semibold text-gray-700 block">{item.loanLength}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

export default Loan;