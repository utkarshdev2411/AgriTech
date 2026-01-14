import React, { useEffect, useRef, useState } from 'react'
import { ImQuotesLeft } from "react-icons/im";
import { MdOutlineAddAPhoto, MdPeopleAlt } from "react-icons/md";
import { FaHandsHoldingCircle, FaSeedling } from "react-icons/fa6";
import { PiPottedPlantBold, PiPlantFill } from "react-icons/pi";
import { FaArrowRight, FaLeaf, FaWind } from "react-icons/fa";
import { GiWheat, GiCorn, GiPlantSeed } from "react-icons/gi";
import { Link } from 'react-router-dom'

const Home = () => {
  // For scroll-based animations
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // For testimonial pagination
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe each section
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <div className='flex flex-col relative overflow-hidden'>
      {/* Floating elements throughout the page */}
      <div className="fixed w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[5%] text-green-200 opacity-10 animate-float-slow">
          <GiWheat size={40} />
        </div>
        <div className="absolute top-[30%] right-[7%] text-amber-200 opacity-10 animate-float-medium">
          <GiCorn size={40} />
        </div>
        <div className="absolute bottom-[15%] left-[10%] text-green-200 opacity-10 animate-float-fast">
          <GiPlantSeed size={30} />
        </div>
        <div className="absolute bottom-[35%] right-[12%] text-blue-200 opacity-10 animate-float-slow">
          <FaWind size={30} />
        </div>
        <div className="absolute top-[60%] left-[15%] text-green-200 opacity-10 animate-float-medium">
          <PiPlantFill size={35} />
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 origin-left transform-gpu scroll-progress"></div>
      </div>

      {/* Hero section with enhanced visual appeal */}
      <div className='min-h-screen bg-gradient-to-b from-[#efffed] via-[#f0f9f1] to-[#e8f5ea] flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 relative overflow-hidden'>
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Enhanced background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[10%] right-[15%] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-medium"></div>
          <div className="absolute top-[30%] left-[25%] w-48 h-48 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse-fast"></div>
          <div className="absolute bottom-[30%] right-[10%] w-56 h-56 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block relative animate-float-slow">
            <FaLeaf className="inline-block text-6xl md:text-7xl text-green-500 mb-5 drop-shadow-md transform rotate-45" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping-slow opacity-70"></div>
          </div>
          
          <h1 className='text-4xl sm:text-5xl md:text-6xl text-slate-800 font-bold leading-tight mb-6 text-shadow-sm tracking-tight'>
            A place for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">every farmer</span> to thrive
          </h1>
          
          <p className='text-lg md:text-xl mt-8 mb-12 text-center mx-auto max-w-2xl text-slate-600 leading-relaxed'>
            From farm to table, we connect you with what matters: a supportive community, expert knowledge, and the tools you need to diagnose your crops and soil, ensuring a bountiful harvest and a thriving farm business.
          </p>

          <div className="relative inline-block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <Link to="/cropdiagnosis" className='relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:translate-y-[-3px] group'>
              Get Started
              <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-0 w-20 h-20 text-green-200 opacity-30 transform -rotate-15 hidden md:block">
            <GiWheat size={80} />
          </div>
          <div className="absolute -bottom-4 right-0 w-16 h-16 text-green-300 opacity-20 transform rotate-45 hidden md:block">
            <FaSeedling size={60} />
          </div>
        </div>
        
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-200 shadow-lg rounded-full flex items-center justify-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <svg className="w-6 h-6 text-green-500 group-hover:text-white relative z-10 transition-colors duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Features section with enhanced cards */}
      <div ref={featuresRef} className='py-24 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-[#f9fffc] relative opacity-0 transition-all duration-1000 ease-out translate-y-10 z-10'>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-6 py-1.5 bg-green-50 rounded-full border border-green-100">
              <span className="text-green-600 font-semibold tracking-wide">Powerful Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 relative">
              Our Features
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-300 to-green-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mt-6">Discover how AgriTech can help transform your farming experience with our specialized tools</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <Link to={'/cropdiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-green-200'>
              <div className="p-4 md:p-4 md:p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-green-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-green-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <MdOutlineAddAPhoto className='text-3xl md:text-4xl text-green-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-base md:text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Crop Diagnosis
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-xs md:text-base text-center text-slate-600 flex-grow'>Upload images of your crops to identify diseases and get tailored treatment recommendations.</p>
                <div className="mt-4 text-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'community'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-blue-200'>
              <div className="p-4 md:p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <MdPeopleAlt className='text-3xl md:text-4xl text-blue-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-base md:text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Community
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-xs md:text-base text-center text-slate-600 flex-grow'>Connect with a vast community of farmers to share ideas, knowledge, and experiences.</p>
                <div className="mt-4 text-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'/soildiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-amber-200'>
              <div className="p-4 md:p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-amber-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <FaHandsHoldingCircle className='text-3xl md:text-4xl text-amber-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-base md:text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Soil Analysis
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-xs md:text-base text-center text-slate-600 flex-grow'>Upload soil test reports to receive detailed analysis and fertilizer recommendations.</p>
                <div className="mt-4 text-center text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'/soildiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-purple-200'>
              <div className="p-4 md:p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-purple-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <PiPottedPlantBold className='text-3xl md:text-4xl text-purple-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-base md:text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Crop Preference
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-xs md:text-base text-center text-slate-600 flex-grow'>Predict the most preferred crop based on your data and soil analysis report.</p>
                <div className="mt-4 text-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials section with improved design matching the website */}
      <div ref={testimonialsRef} className='py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-gradient-to-b from-white via-green-50/20 to-white relative opacity-0 transition-all duration-1000 ease-out translate-y-10 z-10 overflow-hidden'>
        {/* Decorative background elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow hidden md:block"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse-medium hidden md:block"></div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-block px-4 md:px-6 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 mb-6 md:mb-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
            <span className="text-green-600 font-semibold tracking-wide text-sm md:text-base">Creator's Words</span>
          </div>
          
          <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-10 lg:p-12 border border-green-100 hover:shadow-2xl transition-all duration-500 group">
            {/* Quote icon */}
            <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-3 md:p-4 shadow-lg">
                <ImQuotesLeft className="text-2xl md:text-3xl text-white" />
              </div>
            </div>
            
            {/* Decorative corner accents */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-green-200 rounded-tr-2xl opacity-50"></div>
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-green-200 rounded-bl-2xl opacity-50"></div>
            
            <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 font-light leading-relaxed md:leading-relaxed italic mt-6 md:mt-8 mb-8 md:mb-10 relative px-2 md:px-4">
              Agritech started as a hackathon project, with an idea serving the farming community in India. Leverage the farmers with the power of AI and machine learning to learn, diagnose, and grow their crops better. It has been a great journey so far, and we are excited to see how it evolves.
            </blockquote>
            
            {/* Author section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-6 md:pt-8 border-t border-green-100">
              <div className="relative group/avatar">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-30 group-hover/avatar:opacity-75 transition duration-300"></div>
                <div className="relative h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden border-3 border-white shadow-lg transform group-hover/avatar:scale-105 transition-transform duration-300">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Utkarsh Sharma" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-slate-800 text-base md:text-lg lg:text-xl mb-0.5">Utkarsh Sharma</p>
                <p className="text-xs md:text-sm text-green-600 font-medium">Developer of Agritech</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section with fixed layout to match image */}
      <div ref={ctaRef} className="relative py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-br from-[#f0f9f1] via-[#e8f6ea] to-[#e1f5e3] opacity-0 transition-all duration-1000 ease-out translate-y-10 z-10">
        {/* Background with gradient and patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-leaf-pattern opacity-5"></div>
        </div>
        
        {/* Decorative plant elements */}
        <div className="absolute left-0 bottom-0 opacity-10 transform -translate-y-1/4">
          <img src="/plant-silhouette.png" alt="" className="h-64 w-auto" aria-hidden="true" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 drop-shadow-sm">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">grow</span> with us?
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">Join thousands of farmers who are already using AgriTech to improve their yields and farming practices.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <Link to="/signup" className="relative block px-8 py-4 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] border border-green-400/30">
                Create Free Account
              </Link>
            </div>
            
            <Link to="/community" className="px-8 py-4 rounded-lg bg-white text-green-600 border-2 border-green-500 font-bold text-lg hover:bg-green-50 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
              Explore Community
            </Link>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-sm text-green-600 font-medium">No credit card required • Free forever • Cancel anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home