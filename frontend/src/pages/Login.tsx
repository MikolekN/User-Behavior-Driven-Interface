import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tile from '../components/Tile/Tile';
import './Form.css';
import FormInput from '../components/FormInput/FormInput';
import Button from '../components/utils/Button';
import { formValidationRules } from '../components/utils/validationRules';

interface LoginFormData {
	email: string;
	password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
    	email: '',
    	password: ''
    },
    mode: 'onSubmit'
  });

  const { setIsLoggedIn, setUsername }: AuthContext = useOutletContext(); 
  const navigate = useNavigate();
  const [ apiError, setApiError ] = useState({isError: false, errorMessage: ""});

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
    	const response = await fetch("http://127.0.0.1:5000/api/login", {
        	method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				login: email,
				password: password
			}),
			credentials: 'include'
      });

      const responseJson = await response.json();

		if (response.ok) {
			setIsLoggedIn(true);
			setUsername(responseJson.user.login);
			navigate('/dashboard');
		}
		else {
			setApiError({
				isError: true,
				errorMessage: responseJson.message
			});
			throw new Error(responseJson.message);
		}
    }
    catch (error) {
    	console.log(error);
    }
  });

  return (
	<div className="flex items-center justify-center">
		<Tile title="Log in into online banking" className="form-tile w-2/5 bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
			<div className="flex items-center justify-center">
				<div className="max-w-md w-full mx-auto">
					<form className="mt-8 space-y-6" onSubmit={onSubmit}>
					<FormInput 
						label="Email" 
						fieldType="text" 
						register={register('email', {
							required: formValidationRules.email.required,
							pattern: formValidationRules.email.pattern
						})}
						error={errors.email}
						className="w-full"
					/>
					<FormInput 
						label="Password"
						fieldType="password"
						register={register('password', {
							required: formValidationRules.password.required
						})}
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
