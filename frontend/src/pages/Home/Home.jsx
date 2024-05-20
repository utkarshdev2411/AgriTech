import React from 'react'
import { ImQuotesLeft } from "react-icons/im";
import { MdOutlineAddAPhoto,MdPeopleAlt } from "react-icons/md";
import { FaHandsHoldingCircle } from "react-icons/fa6";
import { PiPottedPlantBold } from "react-icons/pi";

import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col '>

      {/* introduction section */}
      <div className='h-[85vh] bg-[#f4fdf7] flex flex-col justify-center items-center '>
        <h1 className='text-7xl text-slate-800 mb-5 tracking-wide font-bold '><ImQuotesLeft /></h1>
        <h1 className='text-7xl text-slate-800 tracking-wide font-bold '>A place for every farmer</h1>
        <p className='text-lg mt-8 mb-12 text-center w-full md:w-[40%] text-slate-600 tracking-wide font-semibold text-wrap'>From farm to table, we connect you with what matters: a supportive community, expert knowledge, and the tools you need to diagnose your crops and soil, ensuring a bountiful harvest and a thriving farm business. </p>

        <Link className='px-6 rounded-md py-3 bg-slate-800 hover:bg-slate-600 text-white font-semibold text-lg'>Get Start</Link>
      </div>

      {/* features section */}
      <div className=' bg-white flex gap-10 items-center justify-center flex-wrap py-28 px-20'>
        <Link to={'/cropdiagnosis'} className='px-17 bg-[#f7f7f7] px-10 py-5 rounded-md flex flex-col items-center justify-center'>
          <div className=" border overflow-hidden h-24 w-24 rounded-full  bg-slate-200 flex justify-center items-center "><MdOutlineAddAPhoto className='text-5xl' /></div>
          <h1 className='text-xl text-slate-800 font-semibold tracking-wide'>Crop Diagnosis</h1>
          <p className='text-center mt-3 text-sm text-slate-600 font-medium tracking-wide w-52'>Click photo and get your crop disease result in real time.  </p>
        </Link>
        <Link to={'/soildiagnosis'} className='px-17 bg-[#f7f7f7] px-10 py-5 rounded-md flex flex-col items-center justify-center'>
          <div className=" border overflow-hidden h-24 w-24 rounded-full  bg-slate-200 flex justify-center items-center "><FaHandsHoldingCircle className='text-5xl' /></div>
          <h1 className='text-xl text-slate-800 font-semibold tracking-wide'>Soil Diagnosis</h1>
          <p className='text-center mt-3 text-sm text-slate-600 font-medium tracking-wide w-52'>Upload Soil report pdf and some details and get real time data about your soil condition.  </p>
        </Link>
        <Link to={'comment'} className='px-17 bg-[#f7f7f7] px-10 py-5 rounded-md flex flex-col items-center justify-center'>
          <div className=" border overflow-hidden h-24 w-24 rounded-full  bg-slate-200 flex justify-center items-center "><MdPeopleAlt className='text-5xl' /></div>
          <h1 className='text-xl text-slate-800 font-semibold tracking-wide'>Community</h1>
          <p className='text-center mt-3 text-sm text-slate-600 font-medium tracking-wide w-52'>Connect with the vast commnunity of farmer to share idea and knowldege.   </p>
        </Link>
        <Link to={'/soildiagnosis'} className='px-17 bg-[#f7f7f7] px-10 py-5 rounded-md flex flex-col items-center justify-center'>
          <div className=" border overflow-hidden h-24 w-24 rounded-full  bg-slate-200 flex justify-center items-center "><PiPottedPlantBold className='text-5xl' /></div>
          <h1 className='text-xl text-slate-800 font-semibold tracking-wide'>Crop preference</h1>
          <p className='text-center mt-3 text-sm text-slate-600 font-medium tracking-wide w-52'> Predict the most preferred crop as per your data and soil report.  </p>
        </Link>

      </div>

      <div className='py-28 px-16 flex flex-col justify-center items-center gap-4 bg-gray-50'>
        <h1 className='text-7xl text-slate-800 mb-5 tracking-wide font-bold '><ImQuotesLeft /></h1>
        <p className='text-xl text-center w-full md:w-[60%]  text-slate-600 mb-5 tracking-wide font-bold '>Introducing our plant disease diagnosis ML program: harnessing Al to swiftly identify and diagnose crop ailments from leaf images. Say goodbye to guesswork, and hello to precision farming.</p>

      </div>

    </div>
  )
}

export default Home