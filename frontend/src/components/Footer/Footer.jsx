import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
const Footer = () => {
  return (

      <div className='flex w-full bg-slate-800 text-white flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 py-10'>
       <span className='text-sm font-bold'>&copy; AGRITECH 2024</span>
       <span className='text-sm font-bold'>Privacy policy</span>
       <span className='text-sm font-bold'>Terms of use</span>
       <span className='text-xl flex items-center justify-center gap-4'>
        <a href="https://www.linkedin.com/in/utkarshdev2411/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
          <FaLinkedin/>
        </a>
        <a href="https://github.com/utkarshdev2411" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
          <FaGithub/>
        </a>
        <a href="mailto:utkarshdev2411@gmail.com" className="hover:text-green-400 transition-colors">
          <FaEnvelope/>
        </a>
       </span>
      </div>
    
  )
}

export default Footer