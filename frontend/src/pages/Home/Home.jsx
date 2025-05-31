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
        <div className="absolute top-[20%] left-[5%] text-green-200 opacity-20 animate-float-slow">
          <GiWheat size={40} />
        </div>
        <div className="absolute top-[30%] right-[7%] text-amber-200 opacity-20 animate-float-medium">
          <GiCorn size={40} />
        </div>
        <div className="absolute bottom-[15%] left-[10%] text-green-200 opacity-20 animate-float-fast">
          <GiPlantSeed size={30} />
        </div>
        <div className="absolute bottom-[35%] right-[12%] text-blue-200 opacity-20 animate-float-slow">
          <FaWind size={30} />
        </div>
        <div className="absolute top-[60%] left-[15%] text-green-200 opacity-20 animate-float-medium">
          <PiPlantFill size={35} />
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 origin-left transform-gpu scroll-progress"></div>
      </div>

      {/* Hero section with enhanced visual appeal */}
      <div className='min-h-screen pt-20 bg-gradient-to-b from-[#efffed] via-[#f0f9f1] to-[#e8f5ea] flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 relative overflow-hidden'>
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
            <Link to="/cropdiagnosis" className='relative inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px] group'>
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
      <div ref={featuresRef} className='py-24 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-[#f9fffc] relative opacity-0 transition-all duration-1000 ease-out translate-y-10'>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-30"></div>
        
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to={'/cropdiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-green-200'>
              <div className="p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-green-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <MdOutlineAddAPhoto className='text-4xl text-green-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Crop Diagnosis
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-center text-slate-600 flex-grow'>Upload images of your crops to identify diseases and get tailored treatment recommendations.</p>
                <div className="mt-4 text-center text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'community'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-blue-200'>
              <div className="p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <MdPeopleAlt className='text-4xl text-blue-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Community
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-center text-slate-600 flex-grow'>Connect with a vast community of farmers to share ideas, knowledge, and experiences.</p>
                <div className="mt-4 text-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'/soildiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-amber-200'>
              <div className="p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-amber-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <FaHandsHoldingCircle className='text-4xl text-amber-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Soil Analysis
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-center text-slate-600 flex-grow'>Upload soil test reports to receive detailed analysis and fertilizer recommendations.</p>
                <div className="mt-4 text-center text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
            
            <Link to={'/soildiagnosis'} className='group rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:border-purple-200'>
              <div className="p-8 flex flex-col h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="h-20 w-20 rounded-full bg-purple-50 flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-100 transition-all duration-300 transform group-hover:scale-110 relative">
                  <PiPottedPlantBold className='text-4xl text-purple-600 transform group-hover:rotate-12 transition-transform duration-500' />
                </div>
                <h3 className='text-xl text-center font-semibold text-slate-800 mb-3 relative'>
                  Crop Preference
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-20 transition-all duration-300"></span>
                </h3>
                <p className='text-center text-slate-600 flex-grow'>Predict the most preferred crop based on your data and soil analysis report.</p>
                <div className="mt-4 text-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Learn more <FaArrowRight className="inline-block ml-1 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials section with improved design matching the website */}
      <div ref={testimonialsRef} className='py-24 px-4 sm:px-8 md:px-16 bg-white relative opacity-0 transition-all duration-1000 ease-out translate-y-10'>
        {/* Soft separator at the top */}
        <div className="absolute -top-5 inset-x-0 flex justify-center">
          <div className="w-1/2 h-10 bg-[#f9fffc] rounded-full transform -rotate-1"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-block px-6 py-1.5 bg-green-50 rounded-full border border-green-100 mb-8">
            <span className="text-green-600 font-semibold tracking-wide">Creators Words</span>
          </div>
          
          <div className="relative">
            <ImQuotesLeft className="text-5xl md:text-6xl text-green-400/20 mx-auto mb-8 transform -rotate-6" />
            <div className="absolute -inset-4 border-2 border-dashed border-green-100 rounded-xl opacity-50"></div>
            
            <blockquote className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed italic mb-10 relative">
              <span className="text-green-600 text-3xl absolute -left-4 top-0">"</span>
              Agritech started as a hackathon project, with an idea serving the farming community in India. Leverage th farmers with the power of AI and machine learning to learn, diagnose, and grow their crops better. It has been a great journey so far, and we are excited to see how it evolves.
              <span className="text-green-600 text-3xl absolute -right-4 bottom-0">"</span>
            </blockquote>
            
            <div className="flex items-center justify-center mt-8">
              <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-green-500 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Farmer testimonial" className="h-full w-full object-cover" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 text-lg">Utkarsh Sharma</p>
                <p className="text-sm text-green-600">Developer of Agritech</p>
              </div>
            </div>
          </div>
          
          {/* Pagination dots - match image style */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-3">
              {[0, 1, 2].map((index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-green-500' : 'bg-green-200'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section with fixed layout to match image */}
      <div ref={ctaRef} className="relative py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-br from-[#f0f9f1] via-[#e8f6ea] to-[#e1f5e3] opacity-0 transition-all duration-1000 ease-out translate-y-10">
        {/* Background with gradient and patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-leaf-pattern opacity-5"></div>
        </div>
        
        {/* Top curve shape */}
        <div className="absolute -top-5 inset-x-0 flex justify-center">
          <div className="w-1/2 h-10 bg-white rounded-full transform rotate-1"></div>
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