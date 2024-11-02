import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, RegisterFormDataSchema } from '../schemas/formValidation/registerSchema';
import { isZodError } from '../schemas/common/commonValidators';

const Register = () => {
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const [ errorMessage, setErrorMessage ] = useState('');
    const { user } = useContext(UserContext);
    const { register } = useContext(AuthContext);
    const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
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

    const onSubmit = handleSubmit(async ({ email, password: userPassword }) => {
        try {
            await register(email, userPassword);
            navigate('/login');
        } catch (error) {
            if (isZodError(error)) {
                setErrorMessage('zod api validation error');
            } else {
                setErrorMessage((error as Error).message || 'An unknown error occurred. Please try again.');
            }
        }
    });

    useEffect(() => {
        if (errorMessage) {
            setApiError({ 
                isError: true, 
                errorMessage 
            });
        }
    }, [errorMessage]);

    return (
        <div className="flex items-center justify-center">
            <Tile title="Register to Online Banking" className="form-tile w-2/5 bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput 
                                label="Email"
                                fieldType="text"
                                register={formRegister('email')}
                                error={errors.email}
                                className="w-full"
                            />
                            <FormInput 
                                label="Password"
                                fieldType="password"
                                register={formRegister('password')}
                                error={errors.password}
                                className="w-full"
                            />
                            <FormInput 
                                label="Confirm Password"
                                fieldType="password"
                                register={formRegister('confirmPassword')}
                                error={errors.confirmPassword}
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

export default Register;
