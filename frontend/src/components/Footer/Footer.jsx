import React from 'react'
import { FaFacebook,FaLinkedin,FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (

      <div className='flex w-full bg-slate-800 text-white flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10 py-10'>
       <span className='text-sm font-bold'>&copy; AGRITECH 2024</span>
       <span className='text-sm font-bold'>Privacy policy</span>
       <span className='text-sm font-bold'>Terms of use</span>
       <span className='text-xl flex items-center justify-center gap-4'>
        <FaFacebook/>
        <FaLinkedin/>
        <FaTwitter/>
       </span>
      </div>
    
  )
}

export default Footer