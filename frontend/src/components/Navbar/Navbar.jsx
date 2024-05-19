import React from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
  
  const user = useSelector(state => state.user.userInfo)
  return (
    <div className='w-full bg-slate-50 flex py-6 items-center justify-around'>
      <Link to={'/'} className='text-xl font-bold tracking-wider '>
        AGRITECH
      </Link>

      <div className='flex gap-6 items-center'>
        <NavLink to={'/'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Home</NavLink>

        <NavLink to={'/diagnosis'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Diagnosis</NavLink>

        <NavLink to={'/commmunity'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Community</NavLink>
        {!user && <Link to={'/login'} className='px-4 py-2 bg-slate-800 hover:bg-slate-600 text-md text-white rounded-md font-bold' >Login</Link>}
      </div>

    </div>
  )
}

export default Navbar