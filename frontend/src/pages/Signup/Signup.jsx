import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {

  const [name,setName]=useState("")
  const [username,setUsername]=useState("")
  const [age,setAge]=useState(16)
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")


  const handleSubmit=()=>{
    console.log({
      name,
      username,
      age,
      password,
      email
    })
  }



  return (
    <div className="bg-white min-h-screen">

      <h1 className=' px-20 py-5 tracking-wide text-xl font-bold'>
        AGRITECH
      </h1>
      <div className='flex bg-gray-100 lg:py-12 flex-col-reverse md:flex-row min-h-[88vh] items-center justify-center '>

        {/* login form  */}
        <div className='flex w-full md:w-1/2 bg-slate-200 md:bg-gray-100 justify-center  items-center  flex-col '>

          <form method='post' action='/user/register' className='flex max-w-fit bg-slate-200   flex-col px-16 py-6'>
            <h1 className='text-xl md:text-3xl text-center font-bold tracking-wider mb-4'>Create an Account</h1>
            <p className=' text-nowrap text-xs md:text-md font-semibold text-gray-600 tracking-tight mb-5'>Please enter your contact details to connect</p>
            {/* name */}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="name">Name</label>
            <input className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="text" id='name' placeholder='Enter your name' value={name} onChange={(e) => { setName(e.target.value) }} required />

            {/* username */}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="username">Username</label>
            <input className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="text" id='username' placeholder='Enter a username' value={username} onChange={(e) => { setUsername(e.target.value) }} required />
            
            {/* age */}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="age">Age</label>
            <input className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="number" id='age' placeholder='Enter your age' min={15} max={100} value={age} onChange={(e) => { setAge(e.target.value) }} required />

            {/* email */}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="email">Email</label>
            <input className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="email" id='email' placeholder='Enter your Email' value={email} onChange={(e) => { setEmail(e.target.value) }} required />

            {/* password */}
            <label className='text-md mb-2 font-semibold tracking-wide' htmlFor="password">Password</label>
            <input className='px-4 mb-2 py-2 bg-transparent rounded-md text-black outline-none border-gray-500 border-[1px]' type="password" id='password' placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} required />

            {/* submit button */}
            <button type='submit' className='px-4 rounded-md py-2 bg-slate-800 text-white font-semibold' onClick={handleSubmit}> Sign up</button>
          </form>
          <h1 className='text-sm text-center  text-gray-500'>Already have an account ?<Link className='font-semibold text-gray-800'> Login here</Link></h1>
        </div>

        {/* png png component */}
        <div className='w-1/2 flex py-8 items-center justify-center' >
          <img className=' w-[100%] sm:w-[70%] lg:w-[60%]' src="https://static.vecteezy.com/system/resources/previews/010/864/459/original/man-farmer-working-with-dump-truck-to-plant-carrot-agricultural-cartoon-character-illustrations-free-png.png" alt="" />
        </div>

      </div>


    </div>
  )
}

export default Signup