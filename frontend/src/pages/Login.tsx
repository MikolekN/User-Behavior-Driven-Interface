import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, LoginFormDataSchema } from '../schemas/loginSchema';

const Login = () => {
    const { user } = useContext(UserContext);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(LoginFormDataSchema),
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onSubmit'
    });

    if (user) return <Navigate to="/dashboard" />;

    const onSubmit = handleSubmit(async ({ email, password }) => {
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            setApiError({
                isError: true,
                errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
            });
        }
    });

    return (
        <div className="flex items-center justify-center">
            <Tile title="Log in into online banking" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput 
                                label="Email" 
                                fieldType="text" 
                                register={register('email')}
                                error={errors.email}
                                className="w-full"
                            />
                            <FormInput 
                                label="Password"
                                fieldType="password"
                                register={register('password')}
                                error={errors.password}
                                className="w-full"
                            />
                            <Button className="w-full">
						        Submit
                            </Button>
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

export default Login;
