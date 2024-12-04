import { useState, useContext, useEffect, ChangeEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanFormData, LoanFormDataSchema } from '../schemas/formValidation/loanSchema';
import { UserContext } from '../context/UserContext';
import { AVAILABLE_LOAN_LENGTH, LOAN_AMOUNT_STEP, MAX_LOAN_AMOUNT, MAX_LOAN_AMOUNT_TEXT, MIN_LOAN_AMOUNT, MIN_LOAN_AMOUNT_TEXT } from './constants';
import { TransferContext } from '../context/TransferContext';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import { RangeSlider } from 'flowbite-react';
import { scrollToTop } from '../components/utils/scroll';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import Label from '../components/utils/Label';
import AccountDetails from '../components/utils/AccountDetails';
import { useTranslation } from 'react-i18next';

const Loan = () => {
    const { t } = useTranslation();
    const { apiError, handleError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext);
    const { createLoan } = useContext(TransferContext);
    const [ sliderValue, setSliderValue ] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoanFormData>({
        resolver: zodResolver(LoanFormDataSchema),
        defaultValues: {
            amount: MIN_LOAN_AMOUNT.toString()
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
        try {
            const requestBody = {
                transferTitle: 'Pożyczka gotówkowa',
                amount: amount
            };
            await createLoan(requestBody);
            await getUser();
            navigate('/dashboard');
        } catch (error) {
            handleError(error);
            scrollToTop('loan-form-wrapper');
        }
    });

    const handleSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setSliderValue(newValue);
        setValue('amount', newValue.toString());
    };

    return (
        <div id='loan-form-wrapper' className="flex items-center justify-center">
            <Tile title={t('loan.tile.title')} className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto px-1">
                        { apiError.isError && 
                            <div className="my-4">
                                <ErrorAlert alertMessage={apiError.errorMessage} />
                            </div> 
                        }
                        <AccountDetails label={t('loan.fromAccount')} user={user} className='w-full p-3 mb-6' />
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput
                                label={t('loan.howMuchMoney')}
                                fieldType="text"
                                register={register('amount')}
                                error={errors.amount}
                                className="w-10/12"
                            >
                                {user.currency}
                            </FormInput>
                            <div>
                                <RangeSlider 
                                    value={sliderValue as number}
                                    onChange={handleSliderChange}
                                    aria-label="input-slider"
                                    min={MIN_LOAN_AMOUNT}
                                    step={LOAN_AMOUNT_STEP}
                                    max={MAX_LOAN_AMOUNT}
                                />
                                <div className="flex justify-between">
                                    <Label label={MIN_LOAN_AMOUNT_TEXT} />
                                    <Label label={MAX_LOAN_AMOUNT_TEXT} />
                                </div>
                            </div>
                            <div className="mt-8">
                                <Label label={t('loan.numberOfInstallments')} />
                                <div className="flex justify-between mt-4">
                                    {AVAILABLE_LOAN_LENGTH.map((item, idx) => (
                                        <div onClick={() => { toggleAnswer(idx); }} style={activeIndex === idx ? { 'background': '#60a5fa' } : {}} key={idx} className="border-2 border-blue-600 cursor-pointer hover:bg-blue-200 border-opacity-20 rounded-lg px-4 py-2">
                                            <Label label={item.loanLength} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">{t('loan.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Loan;