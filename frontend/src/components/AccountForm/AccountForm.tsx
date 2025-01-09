import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { AccountContext } from '../../context/AccountContext';
import Tile from '../Tile/Tile';
import FormInput from '../FormInput/FormInput';
import Button from '../utils/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountFormData, AccountFormDataSchema } from '../../schemas/formValidation/accountSchema';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { scrollToTop } from '../utils/scroll';
import ErrorAlert from '../Alerts/ErrorAlert';
import { useTranslation } from 'react-i18next';
import FormSelect from '../FormSelect/FormSelect';
import { ACCOUNT_TYPE_SELECT_OPTIONS } from '../../pages/constants';

const Account = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { createAccount, updateAccount } = useContext(AccountContext);
    const navigate = useNavigate();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountFormData>({
        resolver: zodResolver(AccountFormDataSchema),
        defaultValues: {
            accountName: '',
            accountType: '',
            currency: ''
        },
        mode: 'onSubmit'
    });

    const onSubmit: SubmitHandler<AccountFormData> = async (data) => {
        console.log(data);
        clearApiError();
        try {
            createAccount({test: "test"}); // add real request body
            navigate('/dashboard');
        } catch (error) {
            handleError(error);
            ///////
            scrollToTop('account-form-wrapper');
        }
    };

    return (
        <div id="account-form-wrapper" className="flex items-center justify-center">
            <Tile title={t('accountFrom.tile.title')} className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        { apiError.isError && 
                            <div className="my-4">
                                <ErrorAlert alertMessage={apiError.errorMessage} />
                            </div> 
                        }
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <FormInput 
                                label={t('accountFrom.accountName')} 
                                fieldType="text"
                                register={register('accountName')}
                                error={errors.accountName}
                                className="w-full"
                            />
                            <FormSelect
                                label={t('accountFrom.accountType')}
                                options={ACCOUNT_TYPE_SELECT_OPTIONS}
                                defaultOption={t('accountFrom.selectAccountType')}
                                register={register('accountType')}
                                error={errors.accountType}
                                className="w-full"
                            />
                            <FormInput 
                                label={t('accountFrom.currency')}
                                fieldType="text"
                                register={register('currency')}
                                error={errors.currency}
                                className="w-full"
                            />
                            <Button isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
						        {isSubmitting ? `${t('accountFrom.loading')}` : `${t('accountFrom.submit')}`}
                            </Button>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Account;
