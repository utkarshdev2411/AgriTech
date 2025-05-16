import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logout from '../Logout'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.userInfo)
  const status = useSelector(state => state.user.status)
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinkClass = ({ isActive }) => 
    `text-lg md:text-xl font-bold tracking-wide relative px-3 py-2 transition-all duration-300 group ${
      isActive 
        ? "text-green-600" 
        : "text-slate-800 hover:text-green-600"
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full ${
      scrolled 
        ? 'bg-white shadow-lg py-3' 
        : 'bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-md py-5'
    } transition-all duration-300`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to={'/'} className="flex items-center group">
          <FaLeaf className="text-green-600 text-2xl mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-green-600">AGRI</span>
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">TECH</span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-slate-800 focus:outline-none bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors duration-200"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to={'/'} className={navLinkClass}>
            Home
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </NavLink>
          <NavLink to={'/soildiagnosis'} className={navLinkClass}>
            Analysis
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </NavLink>
          <NavLink to={'/cropdiagnosis'} className={navLinkClass}>
            Diagnosis
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </NavLink>
          <NavLink to={'/comment'} className={navLinkClass}>
            Community
            <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </NavLink>
          
          <div className="ml-8 flex items-center gap-5">
            {status && (
              <Link to={'/profile'} className="h-12 w-12 overflow-hidden rounded-full border-3 border-green-500 hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                <img src={user?.avatar} alt="profile" className="h-full w-full object-cover" />
              </Link>
            )}
            {!status ? (
              <Link to={'/login'} className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                Login
              </Link>
            ) : (
              <Logout />
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`${
          mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } md:hidden fixed top-[68px] right-0 bottom-0 w-[75%] bg-white shadow-xl transition-all duration-300 ease-in-out z-50 flex flex-col p-6`}>
          <NavLink to={'/'} className="py-4 text-xl font-bold border-b border-gray-100 text-slate-800" onClick={toggleMobileMenu}>Home</NavLink>
          <NavLink to={'/soildiagnosis'} className="py-4 text-xl font-bold border-b border-gray-100 text-slate-800" onClick={toggleMobileMenu}>Analysis</NavLink>
          <NavLink to={'/cropdiagnosis'} className="py-4 text-xl font-bold border-b border-gray-100 text-slate-800" onClick={toggleMobileMenu}>Diagnosis</NavLink>
          <NavLink to={'/comment'} className="py-4 text-xl font-bold border-b border-gray-100 text-slate-800" onClick={toggleMobileMenu}>Community</NavLink>
          
          <div className="mt-8 flex flex-col gap-5">
            {status && (
              <Link to={'/profile'} className="flex items-center gap-4" onClick={toggleMobileMenu}>
                <img src={user?.avatar} alt="profile" className="h-12 w-12 rounded-full border-3 border-green-500" />
                <span className="text-lg font-semibold">{user?.username}</span>
              </Link>
            )}
            {!status ? (
              <Link to={'/login'} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full text-center shadow-md" onClick={toggleMobileMenu}>
                Login
              </Link>
            ) : (
              <div onClick={toggleMobileMenu} className="mt-2">
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar