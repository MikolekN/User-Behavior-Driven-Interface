import { useState, useContext } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import { formValidationRules } from '../components/utils/validationRules';

import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';

interface RegisterFormData {
    email: string,
    password: string,
    confirmPassword: string
}

const Register = () => {
    const [ apiError, setApiError ] = useState({ isError: false, errorMessage: '' });
    const { user } = useContext(UserContext);
    const { register } = useContext(AuthContext);
    const { register: formRegister, control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'onSubmit'
    });
    const password = useWatch({
        control,
        name: 'password',
        defaultValue: '',
    });
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" />;

    const onSubmit = handleSubmit(async ({ email, password: userPassword }) => {
        try {
            await register(email, userPassword);
            navigate('/login');
        } catch (error) {
            setApiError({
                isError: true,
                errorMessage: (error as Error).message || 'An unknown error occurred. Please try again.'
            });
        }
    });

    return (
        <div className="flex items-center justify-center">
            <Tile title="Register to Online Banking" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}>
                            <FormInput 
                                label="Email"
                                fieldType="text"
                                register={formRegister('email', {
                                    required: formValidationRules.email.required,
                                    pattern: formValidationRules.email.pattern
                                })}
                                error={errors.email}
                                className="w-full"
                            />
                            <FormInput 
                                label="Password"
                                fieldType="password"
                                register={formRegister('password', {
                                    required: formValidationRules.password.required,
                                    validate: formValidationRules.password.validate
                                })}
                                error={errors.password}
                                className="w-full"
                            />
                            <FormInput 
                                label="Confirm Password"
                                fieldType="password"
                                register={formRegister('confirmPassword', {
                                    required: formValidationRules.confirmPassword.required,
                                    validate: {
                                        matchPasswords: (value: string) => value === password || 'Passwords do not match'
                                    }
                                })}
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
