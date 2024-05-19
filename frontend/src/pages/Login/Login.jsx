import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { loginAPI } from '../../store/services/userAction';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = dispatch(loginAPI({identifier, password}))
      if (res) {
        setIdentifier("")
        setPassword("")
        toast.success("login successfully")
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className='flex bg-gray-100 lg:py-12 flex-col-reverse md:flex-row h-[88vh] items-center justify-center '>

        {/* login form  */}
        <div className='flex w-1/2 justify-center  items-center py-10 flex-col '>
          <form className='flex max-w-fit bg-slate-200   flex-col px-16 py-10'>
            <h1 className='text-xl md:text-3xl text-center font-bold tracking-wider mb-4'>WELCOME BACK</h1>
            <p className=' text-nowrap text-xs md:text-md font-semibold text-gray-600 tracking-tight mb-7'> Please enter your contact details to connect</p>
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="identifier">Email or Username</label>
            <input className='px-4 mb-4 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type='identifier' id='identifier' placeholder='Enter your Email or Username' value={identifier} onChange={(e) => { setIdentifier(e.target.value) }} required />
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="password">Password</label>
            <input className='px-4 mb-4 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="password" id='password' placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} required />
            <button className='px-4 rounded-md py-2 bg-slate-800 text-white font-semibold' onClick={(e) => handleSubmit(e)}> Login</button>
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