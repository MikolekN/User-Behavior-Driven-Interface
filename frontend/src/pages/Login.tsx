import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import Tile from '../components/Tile/Tile';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, LoginFormDataSchema } from '../schemas/formValidation/loginSchema';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import { scrollToTop } from '../components/utils/scroll';
import ErrorAlert from '../components/Alerts/ErrorAlert';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(LoginFormDataSchema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onSubmit'
    });

    if (user) return <Navigate to="/dashboard" />;

    const onSubmit: SubmitHandler<LoginFormData> = async ({ email, password }: LoginFormData) => {
        clearApiError();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            handleError(error);
            logout();
            scrollToTop('login-form-wrapper');
        }
    };

    return (
        <div id="login-form-wrapper" className="flex items-center justify-center">
            <Tile title={t('login.tile.title')} className="w-2/5 max-w-[60%] h-fit max-h-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        { apiError.isError && 
                            <div className="my-4">
                                <ErrorAlert alertMessage={apiError.errorMessage} />
                            </div> 
                        }
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <FormInput 
                                label={t('login.email')} 
                                fieldType="text" 
                                register={register('email')}
                                error={errors.email}
                                className="w-full"
                            />
                            <FormInput 
                                label={t('login.password')}
                                fieldType="password"
                                register={register('password')}
                                error={errors.password}
                                className="w-full"
                            />
                            <Button isSubmitting={isSubmitting} className="w-full">
						        {isSubmitting ? `${t('login.loading')}` : `${t('login.submit')}`}
                            </Button>
                        </form>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Login;
