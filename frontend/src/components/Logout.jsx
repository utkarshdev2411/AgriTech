import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutAPI } from '../store/services/userAction'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutAPI())
    }
  return (
    <div className='flex justify-end mr-4'>
        <button
            type="submit"
            className="px-4 rounded-md py-2 bg-red-600 text-white font-semibold "
            onClick={handleLogout}
            >
            Logout 
            <i className="fa-solid fa-right-from-bracket ml-2"></i>
          </button>
    </div>
  )
}

export default Logout