import { useState, useContext, useEffect, ChangeEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanFormData, LoanFormDataSchema } from '../../schemas/formValidation/loanSchema';
import { UserContext } from '../../context/UserContext';
import { AVAILABLE_LOAN_LENGTH, LOAN_AMOUNT_STEP, MAX_LOAN_AMOUNT, MAX_LOAN_AMOUNT_TEXT, MIN_LOAN_AMOUNT, MIN_LOAN_AMOUNT_TEXT } from '.././constants';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { FlowbiteRangeSliderTheme, RangeSlider } from 'flowbite-react';
import { scrollToTop } from '../../components/utils/scroll';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import Label from '../../components/utils/Label';
import AccountDetails from '../../components/utils/AccountDetails';
import { useTranslation } from 'react-i18next';
import Button from '../../components/utils/Button';
import { AccountContext } from '../../context/AccountContext';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';
import { SUBMIT_BUTTONS } from '../../event/utils/constants';

const rangeSliderTheme: FlowbiteRangeSliderTheme = {
    "root": {
        "base": "flex"
    },
    "field": {
        "base": "relative w-full",
        "input": {
        "base": "w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-400",
        "sizes": {
            "sm": "h-1",
            "md": "h-2",
            "lg": "h-3"
        }
        }
    }
}

const Loan = () => {
    const { t } = useTranslation();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext)
    const { activeAccount } = useContext(AccountContext);
    const { createLoan } = useContext(TransferContext);
    const [ , setSliderValue ] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<LoanFormData>({
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

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const onSubmit: SubmitHandler<LoanFormData> = async ({ amount }: LoanFormData) => {
        clearApiError();
        try {
            const requestBody = {
                title: 'loan',
                amount: parseFloat(amount)
            };
            await createLoan(requestBody);
            await getUser();
            navigate('/dashboard');
        } catch (error) {
            handleError(error);
            scrollToTop();
        }
    };

    const handleSliderChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setSliderValue(newValue);
        setValue('amount', newValue.toString());
    };

    if (activeAccount === null) {
        return (
            <div id="loan-form-wrapper" className="flex items-center justify-center">
                <ActiveAccountError />
            </div>);
    }

    return (
        <Tile title={t('loan.tile.title')}>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-1">
                    <div id="form-error-alert">
                        { apiError.isError &&
                            <ErrorAlert alertMessage={apiError.errorMessage} />
                        }
                    </div>
                    <AccountDetails label={t('loan.fromAccount')} account={activeAccount!} className='w-full p-3 mb-6' />
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label={t('loan.howMuchMoney')}
                            fieldType="text"
                            register={register('amount')}
                            error={errors.amount}
                            className="w-10/12"
                        >
                            {activeAccount!.currency}
                        </FormInput>
                        <div>
                            <RangeSlider
                                onChange={handleSliderChange}
                                aria-label="input-slider"
                                min={MIN_LOAN_AMOUNT}
                                step={LOAN_AMOUNT_STEP}
                                max={MAX_LOAN_AMOUNT}
                                theme={rangeSliderTheme}
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
                        <Button id={SUBMIT_BUTTONS.LOAN.id} isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                            {isSubmitting ? `${t('loan.loading')}` : `${t('loan.submit')}`}
                        </Button>
                    </form>
                </div>
            </div>
        </Tile>
    );
};

export default Loan;
