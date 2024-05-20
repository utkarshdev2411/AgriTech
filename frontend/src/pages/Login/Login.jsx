import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { loginAPI } from '../../store/services/userAction';
import { useForm } from 'react-hook-form';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const dispatch = useDispatch()


  const onSubmit = async (data) => {
    try {
      const res = dispatch(loginAPI({identifier:data.email, password:data.password}))
      if (res) {
        reset();
        toast.success("login successfully")
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response.request.statusText+" : "+error.response.data.message )
      console.log(error)
      reset();
    }
  }

  return (
    <div className="bg-white ">
      <div className='flex bg-gray-100 lg:py-12 flex-col-reverse md:flex-row h-[88vh] items-center justify-center '>

        {/* login form  */}
        <div className='flex w-1/2 justify-center  items-center py-10 flex-col '>
          <form onSubmit={handleSubmit(onSubmit)} className='flex max-w-fit bg-slate-200   flex-col px-16 py-10'>
            <h1 className='text-xl md:text-3xl text-center font-bold tracking-wider mb-4'>WELCOME BACK</h1>
            <p className=' text-nowrap text-xs md:text-md font-semibold text-gray-600 tracking-tight mb-7'> Please enter your contact details to connect</p>
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="identifier">Email</label>
            <input
              {...register("email", {
                required: "Email is required"
              })} className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="email" id='email' placeholder='Enter your Email' />
            {errors.email && <h1 className='text-red-500 text-sm -mt-2' >*{errors.email.message}</h1>}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="password">Password</label>
            <input
              {...register("password", {
                required: "Length of password 6 or more",
                minLength: 6,
              })} className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="password" id='password' placeholder='Enter a password' />
            {errors.password && <h1 className='text-red-500 text-sm -mt-2' >*{errors.password.message}</h1>}
            <button type='submit' className='px-4 rounded-md py-2 bg-slate-800 text-white font-semibold'> Login</button>
          </form>
          <h1 className='text-sm text-center mt-6 text-gray-500'>don't have an account ?<Link to={'/register'} className='font-semibold text-gray-800'> Sign up here</Link></h1>
        </div>

        {/* png png component */}
        <div className='w-1/2 flex py-8 items-center justify-center' >
          <img className=' w-[100%] sm:w-[70%] lg:w-[60%]' src="https://static.vecteezy.com/system/resources/previews/010/864/459/original/man-farmer-working-with-dump-truck-to-plant-carrot-agricultural-cartoon-character-illustrations-free-png.png" alt="" />
        </div>

      </div>


    </div>
  )
}

export default Login;