import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../../components/Tile/Tile';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/utils/Button';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, RegisterFormDataSchema } from '../../schemas/formValidation/registerSchema';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import { scrollToTop } from '../../components/utils/scroll';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { user } = useContext(UserContext);
    const { register } = useContext(AuthContext);
    const { register: formRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterFormDataSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" />;

    const onSubmit: SubmitHandler<RegisterFormData> = async ({ email, password: userPassword }: RegisterFormData) => {
        clearApiError();
        try {
            await register(email, userPassword);
            navigate('/login');
        } catch (error) {
            handleError(error);
            scrollToTop();
        }
    };

    return (
        <Tile id='register' title={t('register.tile.title')}>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full mx-auto">
                    <div id="form-error-alert">
                        { apiError.isError &&
                            <ErrorAlert alertMessage={apiError.errorMessage} />
                        }
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label={t('register.email')}
                            fieldType="text"
                            register={formRegister('email')}
                            error={errors.email}
                            className="w-full"
                        />
                        <FormInput
                            label={t('register.password')}
                            fieldType="password"
                            register={formRegister('password')}
                            error={errors.password}
                            className="w-full"
                        />
                        <FormInput
                            label={t('register.confirmPassword')}
                            fieldType="password"
                            register={formRegister('confirmPassword')}
                            error={errors.confirmPassword}
                            className="w-full"
                        />
                        <Button isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                            {isSubmitting ? `${t('register.loading')}` : `${t('register.submit')}`}
                        </Button>
                    </form>
                </div>
            </div>
        </Tile>
    );
};

export default Register;
