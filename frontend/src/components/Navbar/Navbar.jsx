import React from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'

const Navbar = () => {
  const navigate=useNavigate();
  const user=useSelector(state=>state.user.userInfo)
  const Logout=()=>{
    toast.warning("Logout successful")
    navigate('/login')
  }
  return (
    <div className='w-full bg-slate-50 flex py-6 items-center justify-around'>
      <Link to={'/'} className='text-xl font-bold tracking-wider '>
        AGRITECH
      </Link>

      <div className='flex gap-6 items-center'>
        <NavLink to={'/'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Home</NavLink>

        <NavLink to={'/soildiagnosis'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Analysis</NavLink>

        <NavLink to={'/comment'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Community</NavLink>
        {!user ? <Link to={'/login'} className='px-4 py-2 bg-slate-800 hover:bg-slate-600 text-md text-white rounded-md font-bold' >Login</Link>:<Link onClick={Logout} className='px-4 py-2 bg-slate-800 hover:bg-slate-600 text-md text-white rounded-md font-bold' >Logout</Link>}
      </div>

    </div>
  )
}

export default Navbar