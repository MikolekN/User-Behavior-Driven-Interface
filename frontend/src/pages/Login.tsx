import { useForm } from 'react-hook-form';

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

  const onSubmit = handleSubmit(({ email, password }) => {
    // finish handling login submit by sending it to backend and necessary validation
    console.log(email, password);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
        <div className="text-center font-semibold text-2xl mb-6 text-gray-700">Log in to Online Banking</div>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-gray-700 block">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address'
                }
              })}
              style={{ borderColor: errors.email ? 'red' : '' }}
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              style={{borderColor: errors.password ? "red": ""}}
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
