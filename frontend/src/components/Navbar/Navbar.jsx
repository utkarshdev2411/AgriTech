import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between'>
      <h1>
        AGRITECH
      </h1>

      <div>
        <Link>Home</Link>
        <Link>Diagnosis</Link>
        <Link>Community</Link>
      </div>

    </div>
  )
}

export default Navbar