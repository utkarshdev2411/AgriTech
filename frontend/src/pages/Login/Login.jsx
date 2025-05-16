import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { loginAPI } from '../../store/services/userAction';
import { useForm } from 'react-hook-form';
import { FaArrowRight, FaLeaf, FaSeedling } from 'react-icons/fa';
import { GiWheat, GiPlantSeed } from 'react-icons/gi';
import { FaWind } from 'react-icons/fa';
import { PiPlantFill } from 'react-icons/pi';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const dispatch = useDispatch();

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
    <div className="relative min-h-[88vh] bg-gradient-to-b from-[#efffed] via-[#f0f9f1] to-[#e8f5ea] overflow-hidden">
      {/* Background patterns and decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating elements */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-green-200 opacity-20 animate-float-slow">
          <GiWheat size={30} />
        </div>
        <div className="absolute top-[20%] right-[8%] text-amber-200 opacity-20 animate-float-medium">
          <FaSeedling size={25} />
        </div>
        <div className="absolute bottom-[15%] left-[12%] text-green-200 opacity-20 animate-float-fast">
          <GiPlantSeed size={20} />
        </div>
        <div className="absolute bottom-[25%] right-[7%] text-blue-200 opacity-20 animate-float-slow">
          <FaWind size={20} />
        </div>
        <div className="absolute top-[50%] left-[20%] text-green-200 opacity-20 animate-float-medium">
          <PiPlantFill size={25} />
        </div>
      </div>
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-medium"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center min-h-[88vh] relative z-10">
        {/* Left column - Form */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center items-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-block relative animate-float-slow mb-2">
                <FaLeaf className="inline-block text-4xl text-green-500 drop-shadow-md transform rotate-45" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping-slow opacity-70"></div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Please sign in to continue your farming journey</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-70"></div>
              
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
                    className="relative w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    Sign In
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>

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

        {/* Right column - Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-full filter blur-xl opacity-70"></div>
            <div className="relative z-10 transform transition-transform duration-500 hover:scale-105">
              <img 
                className="w-full max-w-lg" 
                src="https://static.vecteezy.com/system/resources/previews/010/864/459/original/man-farmer-working-with-dump-truck-to-plant-carrot-agricultural-cartoon-character-illustrations-free-png.png" 
                alt="Farmer illustration" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;