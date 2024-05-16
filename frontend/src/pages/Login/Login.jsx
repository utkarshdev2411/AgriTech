import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = () => {
    console.log(email, password)
  }

  return (
    <div className="bg-white min-h-screen">

      <h1 className=' px-20 py-5 tracking-wide text-xl font-bold'>
        AGRITECH
      </h1>
      <div className='flex bg-gray-100 lg:py-12 flex-col-reverse md:flex-row h-[88vh] items-center justify-center '>

        {/* login form  */}
        <div className='flex w-1/2 justify-center  items-center py-10 flex-col '>
          <form method='post' action='/user/login' className='flex max-w-fit bg-slate-200   flex-col px-16 py-10'>
            <h1 className='text-xl md:text-3xl text-center font-bold tracking-wider mb-4'>WELCOME BACK</h1>
            <p className=' text-nowrap text-xs md:text-md font-semibold text-gray-600 tracking-tight mb-7'> Please enter your contact details to connect</p>
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="username">Email</label>
            <input className='px-4 mb-4 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type='email' id='username' placeholder='Enter your Email' value={email} onChange={(e) => { setEmail(e.target.value) }} required />
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="password">Password</label>
            <input className='px-4 mb-4 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="password" id='password' placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} required />
            <button type='submit' className='px-4 rounded-md py-2 bg-slate-800 text-white font-semibold' onClick={handleSubmit}> Login</button>
          </form>
          <h1 className='text-sm text-center mt-6 text-gray-500'>don't have an account ?<Link className='font-semibold text-gray-800'> Sign up here</Link></h1>
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