import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { signupAPI } from '../../store/services/userAction';

import { useForm } from 'react-hook-form';


const Signup = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
      try {
        const res = dispatch(signupAPI({ 
          fullname: data.fullname,
           username:data.username, 
           email:data.email, 
           password:data.password }))

        if (res) {
          reset();
          toast.success("Sign up successful")
          navigate('/')
        }
        else toast.message("oops something went wrong")
      } catch (err) {
        console.log(err)
        toast.error(err.response.request.statusText + " : " + err.response.data.message)
        reset();
      }
    }



    return (
      <div className="bg-white ">
        <div className='flex bg-gray-100 lg:py-12 flex-col-reverse md:flex-row min-h-[88vh] items-center justify-center '>

          {/* login form  */}
          <div className='flex w-full md:w-1/2 bg-slate-200 md:bg-gray-100 justify-center  items-center  flex-col '>

            <form onSubmit={handleSubmit(onSubmit)} className='flex max-w-fit bg-slate-200 flex-col px-16 py-6'>
              <h1 className='text-xl md:text-3xl text-center font-bold tracking-wider mb-4'>Create an Account</h1>
              <p className=' text-nowrap text-xs md:text-md font-semibold text-gray-600 tracking-tight mb-5'>Please enter your contact details to connect</p>
              {/* name */}
              <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="name">Name</label>
              <input
                {...register("fullname", {
                  required: "Fullname is required"
                })}
                className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="text" id='name' placeholder='Enter your name' />
              {errors.fullname && <h1 className='text-red-500 text-sm -mt-2' >*{errors.fullname.message}</h1>}

              {/* username */}
              <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="username">Username</label>
              <input
                {...register("username", {
                  required: "Username is required"
                })} className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="text" id='username' placeholder='Enter a username' />
              {errors.username && <h1 className='text-red-500 text-sm -mt-2' >*{errors.username.message}</h1>}

              {/* email */}
              <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="email">Email</label>
              <input
                {...register("email", {
                  required: "Email is required"
                })} className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="email" id='email' placeholder='Enter your Email' />
              {errors.email && <h1 className='text-red-500 text-sm -mt-2' >*{errors.email.message}</h1>}


              {/* password */}
              <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="password">Password</label>
              <input
                {...register("password", {
                  required: "Length of password 6 or more",
                  minLength: 6,
                })} className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="password" id='password' placeholder='Enter a password' />
              {errors.password && <h1 className='text-red-500 text-sm -mt-2' >*{errors.password.message}</h1>}

              {/* submit button */}
              <button type='submit' className='px-4 rounded-md py-2 bg-slate-800 text-white font-semibold' >{isSubmitting ? "...sending" : "Sign up"}</button>
            </form>
            <h1 className='text-sm mt-4 text-center  text-gray-500'>Already have an account ?<Link to={'/login'} className='font-semibold text-gray-800'> Login here</Link></h1>
          </div>

          {/* png png component */}
          <div className='w-1/2 flex py-8 items-center justify-center' >
            <img className=' w-[100%] sm:w-[70%] lg:w-[60%]' src="https://static.vecteezy.com/system/resources/previews/010/864/459/original/man-farmer-working-with-dump-truck-to-plant-carrot-agricultural-cartoon-character-illustrations-free-png.png" alt="" />
          </div>

        </div>


      </div>
    )
  }

  export default Signup;