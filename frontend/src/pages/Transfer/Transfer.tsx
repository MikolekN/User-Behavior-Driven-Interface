import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferFormData, TransferFormDataSchema } from '../../schemas/formValidation/transferSchema';
import { UserContext } from '../../context/UserContext';
import Button from '../../components/utils/Button';
import { TransferContext } from '../../context/TransferContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { scrollToTop } from '../../components/utils/scroll';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import AccountDetails from '../../components/utils/AccountDetails';
import { useTranslation } from 'react-i18next';
import { AccountContext } from '../../context/AccountContext';

const Transfer = () => {
    const { t } = useTranslation();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { getUser } = useContext(UserContext);
    const { createTransfer } = useContext(TransferContext);
    const { account } = useContext(AccountContext);
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
    
    const getTransferRequestBody = (data: TransferFormData) => {
        return {
            recipient_account_number: data.recipientAccountNumber,
            title: data.transferTitle,
            amount: data.amount
        }
    }

    const onSubmit: SubmitHandler<TransferFormData> = async (data: TransferFormData) => {
        clearApiError();
        try {
            const requestBody = getTransferRequestBody(data);
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
                        <AccountDetails label={t('transfer.fromAccount')} account={account!} className='w-full p-3 mb-6' />
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
                                {account!.currency}
                            </FormInput>
                            <div>
                                <Button isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
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
