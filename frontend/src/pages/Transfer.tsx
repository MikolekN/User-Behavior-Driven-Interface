import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferFormData, TransferFormDataSchema } from '../schemas/formValidation/transferSchema';
import { UserContext } from '../context/UserContext';
import Button from '../components/utils/Button';
import { TransferContext } from '../context/TransferContext';
import useApiErrorHandler from '../hooks/useApiErrorHandler';

const Transfer = () => {
    const { apiError, handleError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext);
    const { createTransfer } = useContext(TransferContext);
    const { register, handleSubmit, formState: { errors } } = useForm<TransferFormData>({
        resolver: zodResolver(TransferFormDataSchema),
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
            const requestBody = {
                recipientAccountNumber: recipientAccountNumber,
                transferTitle: transferTitle,
                amount: amount
            };
            await createTransfer(requestBody);
            await getUser();
            navigate('/dashboard');
        } catch (error) {
            handleError(error);
        }
    });

    return (
        <div className="flex items-center justify-center">
            <Tile title="Transfer" className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
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
                                register={register('recipientAccountNumber')}
                                error={errors.recipientAccountNumber}
                                className="w-full"
                            />
                            <FormInput
                                label="Title"
                                fieldType="text"
                                register={register('transferTitle')}
                                error={errors.transferTitle}
                                className="w-full"
                            />
                            <FormInput
                                label="Amount"
                                fieldType="text"
                                register={register('amount')}
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
