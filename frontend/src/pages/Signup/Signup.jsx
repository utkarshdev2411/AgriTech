import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { signupAPI } from '../../store/services/userAction';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaLeaf, FaSeedling, FaTractor } from 'react-icons/fa';
import { GiWheat, GiPlantSeed, GiFarmTractor, GiCorn } from 'react-icons/gi';
import { FaWind } from 'react-icons/fa';
import { PiPlantFill } from 'react-icons/pi';

const Signup = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onSubmit = async (data) => {
    try {
      const res = dispatch(signupAPI({ 
        fullname: data.fullname,
        username: data.username, 
        email: data.email, 
        password: data.password 
      }));

      if (res) {
        reset();
        toast.success("Sign up successful");
        navigate('/');
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.request?.statusText + " : " + err.response?.data?.message || "Signup failed");
      reset();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eaffec] via-[#f2faf4] to-[#e9f6eb] overflow-hidden">
      {/* Background patterns and decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements - Enhanced farm theme */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[15%] left-[8%] text-green-300 opacity-10 animate-float-slow">
          <GiWheat size={35} />
        </div>
        <div className="absolute top-[25%] right-[10%] text-amber-300 opacity-10 animate-float-medium">
          <FaSeedling size={30} />
        </div>
        <div className="absolute bottom-[20%] left-[15%] text-green-300 opacity-10 animate-float-fast">
          <GiPlantSeed size={25} />
        </div>
        <div className="absolute bottom-[30%] right-[12%] text-blue-200 opacity-10 animate-float-slow">
          <FaWind size={25} />
        </div>
        <div className="absolute top-[40%] left-[18%] text-green-300 opacity-10 animate-float-medium">
          <PiPlantFill size={30} />
        </div>
        <div className="absolute top-[35%] right-[18%] text-amber-400 opacity-10 animate-float-slow">
          <GiCorn size={32} />
        </div>
        <div className="absolute bottom-[35%] left-[10%] text-green-400 opacity-10 animate-float-medium">
          <GiFarmTractor size={35} />
        </div>
      </div>
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[15%] right-[20%] w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[25%] left-[15%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-medium"></div>
        <div className="absolute top-[45%] left-[30%] w-56 h-56 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center min-h-screen relative z-10">
        {/* Left column - Form */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center items-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-50 rounded-tr-full opacity-50"></div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("fullname", {
                        required: "Full name is required"
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullname && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullname.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      {...register("username", {
                        required: "Username is required"
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

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
                      placeholder="Create a password (6+ characters)"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:shadow-green-500/30 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:-translate-y-0.5 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    <FaSeedling className="mr-2 text-green-100" />
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300">
                    Sign in here
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
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=900&fit=crop&q=80"
                    alt="Community of farmers working together"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Bottom overlay with mission statement */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-semibold mb-1">Join Our Community</p>
                    <p className="text-green-200 text-sm">Growing Together with Smart Farming Solutions</p>
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
  );
};

export default Signup;