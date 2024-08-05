import React from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
    email: string,
    password: string
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    },
      mode: "onChange"
  })

  const onSubmit = handleSubmit(({ email, password }) => {
    console.log(email, password)
  })

  return (
    <div className="min-h-screen flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border-gray-600">
        <div className="max-w-md w-full mx-auto mb-4">
          <div className="text-center font-medium text.xl">
            Login Form
          </div>
        </div>
          <form action="" className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="" className="text-sm font-bold text-gray-600 block">Email</label>
              <input {...register(
                "email", 
                {
                    required: true, 
                    minLength: 6
                })} 
                style={{borderColor: errors.email ? "red": ""}}
                name="email" type="text" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"/>
              {errors.email && <p className="text-gray-600">Email is invalid</p>}
            </div>
            <div>
              <label htmlFor="" className="text-sm font-bold text-gray-600 block">Password</label>
              <input {...register("password", 
                {
                    required: true, 
                    minLength: 6
                })} 
                style={{borderColor: errors.password ? "red": ""}}
                name="password" type="password" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white"/>
                {errors.password && <p className="text-gray-600">Password is invalid</p>}
            </div>
            <div>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">Submit</button>
            </div>
          </form>
        </div>
    </div>
  )
}

export default Login