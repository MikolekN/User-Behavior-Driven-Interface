import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import { formValidationRules } from '../components/utils/validationRules';
import Slider from '@mui/material/Slider';
import { UserContext } from '../context/UserContext';
import { AVAILABLE_LOAN_LENGTH, LOAN_AMOUNT_STEP, MAX_LOAN_AMOUNT, MIN_LOAN_AMOUNT } from './constants';
import { TransferContext } from '../context/TransferContext';

interface LoanFormData {
    amount: number;
    sliderValue: number;
}

const Loan = () => {
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { user, getUser } = useContext(UserContext);
    const { createLoan } = useContext(TransferContext);
    const [ sliderValue, setSliderValue ] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoanFormData>({
        defaultValues: {
            amount: MIN_LOAN_AMOUNT
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();

    const inputAmount = watch('amount');

    useEffect(() => {
        if (!user) return;

        setSliderValue(inputAmount);
    }, [user, inputAmount]);

    if (!user) return <Navigate to="/login" />;  

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    const onSubmit = handleSubmit(async ({ amount }: LoanFormData) => {
        try {
            const requestBody = {
                recipientAccountNumber: user.accountNumber,
                transferTitle: 'Pożyczka gotówkowa',
                amount: amount
            };
            await createLoan(requestBody);
            await getUser();
            navigate('/dashboard');
        } catch (error) {
            setApiError({
                isError: true,
                errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
            });
        }
    });

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        const sliderVal = newValue as number; 
        setSliderValue(sliderVal);
        setValue('amount', sliderVal);
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
                                register={register('amount', {
                                    required: formValidationRules.loanAmount.required,
                                    min: formValidationRules.loanAmount.min,
                                    max: formValidationRules.loanAmount.max,
                                    pattern: formValidationRules.loanAmount.pattern
                                })}
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
                                    min={MIN_LOAN_AMOUNT}
                                    step={LOAN_AMOUNT_STEP}
                                    max={MAX_LOAN_AMOUNT}
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
                                    {AVAILABLE_LOAN_LENGTH.map((item, idx) => (
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