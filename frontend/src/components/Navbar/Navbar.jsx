import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
// import {toast} from 'react-toastify'
// import { logoutAPI } from '../../store/services/userAction'
import Logout from '../Logout'

const Navbar = () => {
  const navigate=useNavigate();
  // const dispatch = useDispatch()
  const user=useSelector(state=>state.user.userInfo)

  const status = useSelector(state=>state.user.status)
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
        <NavLink to={'/cropdiagnosis'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Diagnosis</NavLink>

        <NavLink to={'/comment'}  className={({isActive}) => {
          return `text-md tracking-wider hover:text-blue-500 font-medium ${isActive ? "text-blue-700" : ""}`
        }}>Community</NavLink>
        {status && <Link to={'/profile'} className='h-10 border-[1px] border-slate-400 w-10 rounded-full ' >
            <img src={user && user.avatar} alt="profile" />
            </Link>}
        {!status ? <Link to={'/login'} className='px-4 py-2 bg-slate-800 hover:bg-slate-600 text-md text-white rounded-md font-bold' >Login</Link>:<Logout/>}

        
      </div>

    </div>
  )
}

export default Navbar