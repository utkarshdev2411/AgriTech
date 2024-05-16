import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='w-full bg-slate-50 flex py-6 items-center justify-around'>
      <h1 className='text-xl font-semibold tracking-wider '>
        AGRITECH
      </h1>

      <div className='flex gap-6 items-center'>
        <Link to={'/'} className='text-md tracking-wider font-medium'>Home</Link>
        <Link to={'/'} className='text-md tracking-wider font-medium'>Diagnosis</Link>
        <Link  to={'/'} className='text-md tracking-wider font-medium'>Community</Link>
      </div>

    </div>
  )
}

export default Navbar