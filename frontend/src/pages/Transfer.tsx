import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferFormData, TransferFormDataSchema } from '../schemas/formValidation/transferSchema';
import { UserContext } from '../context/UserContext';
import Button from '../components/utils/Button';
import { TransferContext } from '../context/TransferContext';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import { scrollToTop } from '../components/utils/scroll';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import AccountDetails from '../components/utils/AccountDetails';
import { useTranslation } from 'react-i18next';

const Transfer = () => {
    const { t } = useTranslation();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user, getUser } = useContext(UserContext);
    const { createTransfer } = useContext(TransferContext);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransferFormData>({
        resolver: zodResolver(TransferFormDataSchema),
        defaultValues: {
            recipientAccountNumber: '',
            transferTitle: '',
            amount: ''
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();
    
    const onSubmit: SubmitHandler<TransferFormData> = async ({ recipientAccountNumber, transferTitle, amount }: TransferFormData) => {
        clearApiError();
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
            scrollToTop('transfer-form-wrapper');
        }
    };

    return (
        <div id="transfer-form-wrapper" className="flex items-center justify-center">
            <Tile title={t('transfer.tile.title')} className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        { apiError.isError && 
                            <div className="my-4">
                                <ErrorAlert alertMessage={apiError.errorMessage} />
                            </div> 
                        }
                        <AccountDetails label={t('transfer.fromAccount')} user={user!} className='w-full p-3 mb-6' />
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <FormInput 
                                label={t('transfer.recipientAccountNumber')}
                                fieldType="text"
                                register={register('recipientAccountNumber')}
                                error={errors.recipientAccountNumber}
                                className="w-full"
                            />
                            <FormInput
                                label={t('transfer.transferTitle')}
                                fieldType="text"
                                register={register('transferTitle')}
                                error={errors.transferTitle}
                                className="w-full"
                            />
                            <FormInput
                                label={t('transfer.amount')}
                                fieldType="text"
                                register={register('amount')}
                                error={errors.amount}
                                className="w-10/12"
                            >
                                {user!.currency}
                            </FormInput>
                            <div>
                                <Button isSubmitting={isSubmitting} className="w-full">
                                    {isSubmitting ? `${t('transfer.loading')}` : `${t('transfer.submit')}`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Transfer;
