import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { loginAPI } from '../../store/services/userAction';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaLeaf, FaSeedling, FaTractor, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { GiWheat, GiPlantSeed, GiFarmTractor, GiCorn } from 'react-icons/gi';
import { FaWind } from 'react-icons/fa';
import { PiPlantFill } from 'react-icons/pi';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const [copiedField, setCopiedField] = useState(null);

  // Guest credentials - Update these with your actual credentials
  const guestCredentials = {
    email: 'guest@agritech.com',
    password: 'guest123'
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const onSubmit = async (data) => {
    try {
      const res = dispatch(loginAPI({identifier:data.email, password:data.password}));
      if (res) {
        reset();
        toast.success("Login successful");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.request?.statusText + " : " + error.response?.data?.message || "Login failed");
      console.log(error);
      reset();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#e8f5df] via-[#f0f9f1] to-[#e8f5ea] overflow-hidden">
      {/* Background patterns and decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements - Enhanced farm theme */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-green-300 opacity-10 animate-float-slow">
          <GiWheat size={30} />
        </div>
        <div className="absolute top-[20%] right-[8%] text-amber-300 opacity-10 animate-float-medium">
          <FaSeedling size={25} />
        </div>
        <div className="absolute bottom-[15%] left-[12%] text-green-300 opacity-10 animate-float-fast">
          <GiPlantSeed size={20} />
        </div>
        <div className="absolute bottom-[25%] right-[7%] text-blue-200 opacity-10 animate-float-slow">
          <FaWind size={20} />
        </div>
        <div className="absolute top-[50%] left-[20%] text-green-300 opacity-10 animate-float-medium">
          <PiPlantFill size={25} />
        </div>
        <div className="absolute top-[30%] right-[15%] text-amber-400 opacity-10 animate-float-slow">
          <GiCorn size={28} />
        </div>
        <div className="absolute bottom-[40%] left-[8%] text-green-400 opacity-10 animate-float-medium">
          <GiFarmTractor size={30} />
        </div>
      </div>
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-medium"></div>
        <div className="absolute top-[40%] left-[25%] w-48 h-48 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center min-h-screen relative z-10">
        {/* Left column - Form */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center items-center">
          <div className="w-full max-w-md">

            <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-50 rounded-tr-full opacity-50"></div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register("email", {
                        required: "Email is required"
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password", {
                        required: "Password must be at least 6 characters",
                        minLength: 6,
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/30 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:-translate-y-0.5 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <FaTractor className="mr-2 text-green-100" />
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>

              {/* Guest Credentials Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500 rounded-full p-1.5 mr-2">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-green-800">Try with Guest Credentials</p>
                  </div>
                  <div className="space-y-2">
                    {/* Email */}
                    <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-green-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                        <p className="text-sm font-mono text-gray-800 truncate">{guestCredentials.email}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(guestCredentials.email, 'Email')}
                        className="ml-2 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 flex-shrink-0"
                        title="Copy email"
                      >
                        {copiedField === 'Email' ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {/* Password */}
                    <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-green-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Password</p>
                        <p className="text-sm font-mono text-gray-800 truncate">{guestCredentials.password}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(guestCredentials.password, 'Password')}
                        className="ml-2 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 flex-shrink-0"
                        title="Copy password"
                      >
                        {copiedField === 'Password' ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaCopy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-3 text-center">Click the copy icons to paste credentials quickly</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Featured Image - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {/* Animated border container */}
            <div className="relative p-1 rounded-3xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 animate-gradient-x">
              {/* Inner glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-50 animate-pulse-slow"></div>
              
              {/* White background card */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Decorative corner accents with animation */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 z-10 animate-pulse-slow"></div>
                
                {/* 4:3 Aspect Ratio Container */}
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=900&fit=crop&q=80"
                    alt="Modern agriculture with technology"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Bottom overlay with mission statement */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-semibold mb-1">Empowering Farmers</p>
                    <p className="text-green-200 text-sm">Smart Technology for Sustainable Agriculture</p>
                  </div>
                </div>
                
                {/* Decorative dots pattern */}
                <div className="absolute top-4 left-4 grid grid-cols-3 gap-1 opacity-30">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;