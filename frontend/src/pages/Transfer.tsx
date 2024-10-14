import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import { formValidationRules } from '../components/utils/validationRules';
import { UserContext } from '../context/UserContext';
import { isErrorResponse } from '../components/utils/types/ErrorResponse';
import Button from '../components/utils/Button';

interface TransferFormData {
    recipientAccountNumber: string;
    transferTitle: string;
    amount: string;
}

const Transfer = () => {
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { user, getUser } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors } } = useForm<TransferFormData>({
        defaultValues: {
            recipientAccountNumber: '',
            transferTitle: '',
            amount: ''
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();


    if (!user) return <Navigate to="/login" />;  
    
    const onSubmit = handleSubmit(async ({ recipientAccountNumber, transferTitle, amount }: TransferFormData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    recipientAccountNumber,
                    transferTitle,
                    amount
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
            // Tutaj należy przerobić jak są ustawiane errory - niektóre idą na setApiError, niektóre na konsole
        }
    });

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transfer" className="form-tile w-2/5  bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
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
                                label="Recipient account number"
                                fieldType="text"
                                register={register('recipientAccountNumber', {
                                    required: formValidationRules.recipientAccountNumber.required,
                                    pattern: formValidationRules.recipientAccountNumber.pattern
                                })}
                                error={errors.recipientAccountNumber}
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
                                {user.currency}
                            </FormInput>
                            <div>
                                <Button className="w-full">
                                    Submit
                                </Button>
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

export default Transfer;
