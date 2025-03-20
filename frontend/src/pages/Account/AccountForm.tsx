import { useCallback, useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { AccountContext } from '../../context/AccountContext';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/utils/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountFormData, AccountFormDataSchema } from '../../schemas/formValidation/accountSchema';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { scrollToTop } from '../../components/utils/scroll';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import { useTranslation } from 'react-i18next';
import FormSelect from '../../components/FormSelect/FormSelect';
import { ACCOUNT_TYPE_SELECT_OPTIONS } from '../constants';
import { Account } from '../../components/utils/types/Account';
import { SUBMIT_BUTTONS } from '../../event/utils/constants';

const AccountForm = () => {
    const { t } = useTranslation();
    const { user, getUser } = useContext(UserContext);
    const { accountNumber } = useParams();
    const { account, setAccount, getAccount, createAccount, updateAccount } = useContext(AccountContext);
    const navigate = useNavigate();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<AccountFormData>({
        resolver: zodResolver(AccountFormDataSchema),
        defaultValues: {
            accountName: '',
            accountType: '',
            currency: ''
        },
        mode: 'onSubmit'
    });

    const setAccountFormDefaultValues = useCallback(() => {
        setValue('accountName', '');
        setValue('accountType', '');
        setValue('currency', '');
    }, [setValue]);

    const setAccountFormEditValues = useCallback((account: Account) => {
        setValue('accountName', account.accountName);
        setValue('accountType', account.accountType);
        setValue('currency', account.currency);
    }, [setValue]);

    useEffect(() => {
        if (!user) return;

        if (accountNumber) {
            const fetchAccountByAccountNumber = async () => {
                try {
                    await getAccount(accountNumber);
                } catch (error) {
                    handleError(error);
                }
            };

            void fetchAccountByAccountNumber();
        } else {
            setAccount(null);
        }

    }, [user, accountNumber, setAccount, getAccount]);

    useEffect(() => {
        if (account) {
            setAccountFormEditValues(account);
        } else {
            setAccountFormDefaultValues();
        }
    }, [account, setAccountFormEditValues, setAccountFormDefaultValues]);

    const getAccountRequestBody = (data: AccountFormData) => {
        return {
            name: data.accountName,
            type: data.accountType,
            currency: data.currency
        };
    };

    const onSubmit: SubmitHandler<AccountFormData> = async (data: AccountFormData) => {
        clearApiError();
        const requestBody = getAccountRequestBody(data);
        if (account === null) {
            try {
                await createAccount(requestBody);
                navigate('/accounts');
            } catch (error) {
                handleError(error);
                scrollToTop();
            }
        } else {
            try {
                await updateAccount(accountNumber!, requestBody);
                await getUser();
                navigate('/accounts');
            } catch (error) {
                handleError(error);
                scrollToTop();
            }
        }
    };

    return (
        <Tile title={t('accountForm.tile.title')}>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full mx-auto">
                    <div id="form-error-alert">
                        { apiError.isError &&
                            <ErrorAlert alertMessage={apiError.errorMessage} />
                        }
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label={t('accountForm.accountName')}
                            fieldType="text"
                            register={register('accountName')}
                            error={errors.accountName}
                            className="w-full"
                        />
                        <FormSelect
                            label={t('accountForm.accountType')}
                            options={ACCOUNT_TYPE_SELECT_OPTIONS}
                            defaultOption={t('accountForm.selectAccountType')}
                            register={register('accountType')}
                            error={errors.accountType}
                            className="w-full"
                        />
                        <FormInput
                            label={t('accountForm.currency')}
                            fieldType="text"
                            register={register('currency')}
                            error={errors.currency}
                            className="w-full"
                        />
                        <Button id={SUBMIT_BUTTONS.ACCOUNT.id} isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                        {isSubmitting
                            ? t('accountForm.loading')
                            : accountNumber
                                ? t('accountForm.edit')
                                : t('accountForm.submit')
                        }
                        </Button>
                    </form>
                </div>
            </div>
        </Tile>
    );
};

export default AccountForm;
