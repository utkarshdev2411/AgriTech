import React, { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { FaCloudUploadAlt, FaFileAlt, FaLeaf, FaSeedling, FaWater } from 'react-icons/fa';
import { GiPlantSeed, GiWheat, GiFarmTractor } from 'react-icons/gi';
import { BsLayersFill } from 'react-icons/bs';
import { MdWaterDrop, MdOutlineScience, MdAnalytics } from 'react-icons/md';
import { TbPlant } from 'react-icons/tb';
import { BsCloudRainFill, BsThermometerHalf } from 'react-icons/bs';
import { motion } from 'framer-motion';

const SoilDiagnosis = () => {
    const { control, register, handleSubmit, watch, reset, setValue, 
           formState: { errors, isSubmitting } } = useForm();
    
    const [isCustom, setIsCustom] = useState(false);
    const [report, setReport] = useState({ answer: '' });
    const [reportFile, setReportFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [loading, setLoading] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const formRef = useRef(null);
    const resultRef = useRef(null);

    // Animation scroll effect
    useEffect(() => {
        if (isReportVisible && resultRef.current) {
            if (window.innerWidth < 1024) {
                resultRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [isReportVisible]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReportFile(file);
            
            // Show preview for PDF
            if (file.type === 'application/pdf') {
                setFilePreview('/pdf-icon.png'); // Use a PDF icon image
            } else if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setIsReportVisible(true);
        
        const irrigation = selectedOption === 'custom' ? data.customIrrigation : data.irrigation;
        
        // Create a FormData object to hold the form data
        const formData = new FormData();
        
        // Append basic info
        formData.append('rainfall', data.rainfall);
        formData.append('temp', data.temp);
        formData.append('area', data.area);
        formData.append('irrigation', irrigation);
        
        // Append soil properties if available
        if (data.soilType) formData.append('soilType', data.soilType);
        if (data.pH) formData.append('pH', data.pH);
        if (data.organicMatter) formData.append('organicMatter', data.organicMatter);
        if (data.nitrogen) formData.append('nitrogen', data.nitrogen);
        if (data.phosphorus) formData.append('phosphorus', data.phosphorus);
        if (data.potassium) formData.append('potassium', data.potassium);
        
        // Append cropping history if available
        if (data.previousCrop) formData.append('previousCrop', data.previousCrop);
        if (data.cropRotation) formData.append('cropRotation', data.cropRotation);
        if (data.yearsOfFarming) formData.append('yearsOfFarming', data.yearsOfFarming);
        
        // Append the file
        if (reportFile) {
            formData.append("report", reportFile);
        }

        try {
            // First API call
            await axios.post('http://localhost:8000/diagnosis/soil', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            // Second API call
            const res = await axios.post('http://localhost:5123/report', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            setReport(res.data);
        } catch (error) {
            console.error('Error submitting form:', error);
            setReport({ 
                answer: 'Sorry, we encountered an error analyzing your soil data. Please try again later.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[88vh] w-full py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f4fdf7] to-[#f9fcfa] relative overflow-hidden"
        >
            {/* Background decorative elements */}
            <div className="absolute top-[15%] right-[10%] text-green-100 opacity-20 animate-float-slow">
                <BsLayersFill size={80} />
            </div>
            <div className="absolute bottom-[20%] left-[5%] text-green-200 opacity-10 animate-float-medium">
                <GiWheat size={70} />
            </div>
            <div className="absolute top-[60%] right-[8%] text-amber-100 opacity-15 animate-float-slow">
                <FaSeedling size={60} />
            </div>
            
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
                {/* Header section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 relative inline-block">
                        Soil Diagnosis & Analysis
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto mt-4">
                        Enter your soil details below to receive a comprehensive analysis, recommendations for improvements, and suggested crops based on your soil conditions.
                    </p>
                </div>
                {/* Only show the form if not isReportVisible or no report.answer */}
                {!(isReportVisible && report.answer) ? (
                    <div className="w-full flex justify-center items-start">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="w-full max-w-2xl bg-white/95 p-8 rounded-2xl shadow-xl border border-green-100 mb-8 relative overflow-hidden flex flex-col items-center"
                            style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.08)' }}
                        >
                            {/* Form tabs */}
                            <div className="flex mb-8 border-b border-green-100 justify-center gap-2">
                                <button 
                                    className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 relative focus:outline-none ${activeTab === 'basic' ? 'text-green-700 bg-green-50 border-b-2 border-green-500' : 'text-slate-500 hover:text-green-700'}`}
                                    onClick={() => setActiveTab('basic')}
                                >
                                    Basic Info
                                </button>
                                <button 
                                    className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 relative focus:outline-none ${activeTab === 'soil' ? 'text-green-700 bg-green-50 border-b-2 border-green-500' : 'text-slate-500 hover:text-green-700'}`}
                                    onClick={() => setActiveTab('soil')}
                                >
                                    Soil Properties
                                </button>
                                <button 
                                    className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 relative focus:outline-none ${activeTab === 'history' ? 'text-green-700 bg-green-50 border-b-2 border-green-500' : 'text-slate-500 hover:text-green-700'}`}
                                    onClick={() => setActiveTab('history')}
                                >
                                    Crop History
                                </button>
                                <button 
                                    className={`px-5 py-2 font-semibold rounded-t-lg transition-all duration-200 relative focus:outline-none ${activeTab === 'report' ? 'text-green-700 bg-green-50 border-b-2 border-green-500' : 'text-slate-500 hover:text-green-700'}`}
                                    onClick={() => setActiveTab('report')}
                                >
                                    Test Report
                                </button>
                            </div>
                            <form ref={formRef} className="space-y-7 w-full" onSubmit={handleSubmit(onSubmit)}>
                                {/* Basic Info Fields */}
                                <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="rainfall">
                                                <BsCloudRainFill className="mr-2 text-blue-500" /> Rainfall (mm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                id="rainfall"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Annual rainfall in millimeters"
                                                {...register("rainfall", {
                                                    required: "Rainfall data is required",
                                                    min: { value: 0, message: "Value must be positive" }
                                                })}
                                            />
                                            {errors.rainfall && <p className='text-red-500 text-sm mt-1'>{errors.rainfall.message}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="temp">
                                                <BsThermometerHalf className="mr-2 text-red-500" /> Temperature (°C)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                id="temp"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Average temperature in Celsius"
                                                {...register("temp", {
                                                    required: "Temperature is required",
                                                    min: { value: -50, message: "Minimum temperature is -50°C" },
                                                    max: { value: 60, message: "Maximum temperature is 60°C" }
                                                })}
                                            />
                                            {errors.temp && <p className='text-red-500 text-sm mt-1'>{errors.temp.message}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="area">
                                            <MdAnalytics className="mr-2 text-emerald-500" /> Land Area (Hectares)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="area"
                                            className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                            placeholder="Size of your land in hectares"
                                            {...register("area", {
                                                required: "Land area is required",
                                                min: { value: 0, message: "Area must be positive" }
                                            })}
                                        />
                                        {errors.area && <p className='text-red-500 text-sm mt-1'>{errors.area.message}</p>}
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="irrigation">
                                            <FaWater className="mr-2 text-blue-600" /> Irrigation Technique
                                        </label>
                                        <Controller
                                            name="irrigation"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <select
                                                    id="irrigation"
                                                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value);
                                                        setSelectedOption(value);
                                                        setIsCustom(value === 'custom');
                                                        if (value !== 'custom') {
                                                            setValue('customIrrigation', '');
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select irrigation method</option>
                                                    <option value="well and tubewell">Well and Tubewell</option>
                                                    <option value="sprinkler">Sprinkler System</option>
                                                    <option value="drip">Drip Irrigation</option>
                                                    <option value="canal">Canal Irrigation</option>
                                                    <option value="tank">Water Tank / Reservoir</option>
                                                    <option value="rainwater">Rainwater Harvesting</option>
                                                    <option value="custom">Other (Please specify)</option>
                                                </select>
                                            )}
                                        />
                                        {errors.irrigation && <p className='text-red-500 text-sm mt-1'>{errors.irrigation.message}</p>}
                                        
                                        {isCustom && (
                                            <div className="mt-3">
                                                <input
                                                    type="text"
                                                    className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                    placeholder="Specify your irrigation method"
                                                    {...register("customIrrigation", {
                                                        required: isCustom ? "Please specify your irrigation method" : false
                                                    })}
                                                />
                                                {errors.customIrrigation && <p className='text-red-500 text-sm mt-1'>{errors.customIrrigation.message}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Soil Properties */}
                                <div className={activeTab === 'soil' ? 'block' : 'hidden'}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="soilType">
                                                <BsLayersFill className="mr-2 text-amber-700" /> Soil Type
                                            </label>
                                            <select
                                                id="soilType"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                {...register("soilType")}
                                            >
                                                <option value="">Select soil type (if known)</option>
                                                <option value="clay">Clay Soil</option>
                                                <option value="sandy">Sandy Soil</option>
                                                <option value="silty">Silty Soil</option>
                                                <option value="peaty">Peaty Soil</option>
                                                <option value="chalky">Chalky Soil</option>
                                                <option value="loamy">Loamy Soil</option>
                                                <option value="clayLoam">Clay Loam</option>
                                                <option value="sandyLoam">Sandy Loam</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="pH">
                                                <MdOutlineScience className="mr-2 text-purple-600" /> Soil pH
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                id="pH"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Soil pH value (if known)"
                                                {...register("pH", {
                                                    min: { value: 0, message: "pH must be between 0 and 14" },
                                                    max: { value: 14, message: "pH must be between 0 and 14" }
                                                })}
                                            />
                                            {errors.pH && <p className='text-red-500 text-sm mt-1'>{errors.pH.message}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="organicMatter">
                                            <GiPlantSeed className="mr-2 text-green-700" /> Organic Matter (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="organicMatter"
                                            className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                            placeholder="Organic matter percentage (if known)"
                                            {...register("organicMatter", {
                                                min: { value: 0, message: "Value must be positive" },
                                                max: { value: 100, message: "Value cannot exceed 100%" }
                                            })}
                                        />
                                        {errors.organicMatter && <p className='text-red-500 text-sm mt-1'>{errors.organicMatter.message}</p>}
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 italic mt-4 mb-2">
                                        If you have NPK values from a soil test, enter them below (optional):
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="nitrogen">
                                                <span className="font-bold text-blue-600 mr-1">N</span> Nitrogen (ppm)
                                            </label>
                                            <input
                                                type="number"
                                                id="nitrogen"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Nitrogen value"
                                                {...register("nitrogen", {
                                                    min: { value: 0, message: "Value must be positive" }
                                                })}
                                            />
                                            {errors.nitrogen && <p className='text-red-500 text-sm mt-1'>{errors.nitrogen.message}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="phosphorus">
                                                <span className="font-bold text-red-600 mr-1">P</span> Phosphorus (ppm)
                                            </label>
                                            <input
                                                type="number"
                                                id="phosphorus"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Phosphorus value"
                                                {...register("phosphorus", {
                                                    min: { value: 0, message: "Value must be positive" }
                                                })}
                                            />
                                            {errors.phosphorus && <p className='text-red-500 text-sm mt-1'>{errors.phosphorus.message}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="potassium">
                                                <span className="font-bold text-purple-600 mr-1">K</span> Potassium (ppm)
                                            </label>
                                            <input
                                                type="number"
                                                id="potassium"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="Potassium value"
                                                {...register("potassium", {
                                                    min: { value: 0, message: "Value must be positive" }
                                                })}
                                            />
                                            {errors.potassium && <p className='text-red-500 text-sm mt-1'>{errors.potassium.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Cropping History */}
                                <div className={activeTab === 'history' ? 'block' : 'hidden'}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="previousCrop">
                                                <GiWheat className="mr-2 text-amber-600" /> Previous Crop
                                            </label>
                                            <input
                                                type="text"
                                                id="previousCrop"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="What did you grow last season?"
                                                {...register("previousCrop")}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="yearsOfFarming">
                                                <GiFarmTractor className="mr-2 text-green-700" /> Years of Farming
                                            </label>
                                            <input
                                                type="number"
                                                id="yearsOfFarming"
                                                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                                placeholder="How long have you been farming this land?"
                                                {...register("yearsOfFarming", {
                                                    min: { value: 0, message: "Value must be positive" }
                                                })}
                                            />
                                            {errors.yearsOfFarming && <p className='text-red-500 text-sm mt-1'>{errors.yearsOfFarming.message}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="cropRotation">
                                            <TbPlant className="mr-2 text-emerald-600" /> Crop Rotation
                                        </label>
                                        <select
                                            id="cropRotation"
                                            className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                            {...register("cropRotation")}
                                        >
                                            <option value="">Do you practice crop rotation?</option>
                                            <option value="yes">Yes, regularly</option>
                                            <option value="sometimes">Sometimes</option>
                                            <option value="no">No</option>
                                            <option value="planning">Planning to start</option>
                                        </select>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center text-slate-700 font-medium mb-1.5" htmlFor="fertilizersUsed">
                                            <MdOutlineScience className="mr-2 text-blue-600" /> Fertilizers Used
                                        </label>
                                        <textarea
                                            id="fertilizersUsed"
                                            className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50/40 text-lg placeholder:text-slate-400 transition-all"
                                            rows="3"
                                            placeholder="List any fertilizers you've used in the past year"
                                            {...register("fertilizersUsed")}
                                        ></textarea>
                                    </div>
                                </div>
                                
                                {/* Upload Report Tab */}
                                <div className={activeTab === 'report' ? 'block' : 'hidden'}>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center">
                                        <div className="mb-4">
                                            {filePreview ? (
                                                <div className="mx-auto w-24 h-24 mb-3 relative">
                                                    <img 
                                                        src={filePreview} 
                                                        alt="File preview" 
                                                        className="w-full h-full object-cover rounded-md shadow-sm"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                                        onClick={() => {
                                                            setReportFile(null);
                                                            setFilePreview('');
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <FaCloudUploadAlt className="mx-auto text-green-500 text-5xl mb-2" />
                                            )}
                                        </div>
                                        <label htmlFor="reportFile" className="cursor-pointer flex justify-center">
                                            <span className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-md">
                                                {filePreview ? 'Change File' : 'Upload Soil Test Report'}
                                            </span>
                                            <input
                                                type="file"
                                                id="reportFile"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="mt-3 text-sm text-slate-600">
                                            Upload PDF or image files of your soil test reports
                                        </p>
                                        {reportFile && (
                                            <div className="mt-3 flex items-center justify-center text-sm text-slate-700">
                                                <FaFileAlt className="mr-2 text-green-500" />
                                                {reportFile.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-green-800 flex items-center">
                                            <FaLeaf className="mr-2" /> Why upload soil test reports?
                                        </h3>
                                        <p className="mt-1 text-sm text-green-700">
                                            Uploading your soil test reports helps us provide more accurate recommendations for soil improvements and crop selection. We can analyze nutrient levels, pH, and other important factors.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Submit button - visible on all tabs */}
                                <div className="pt-4 border-t border-gray-200 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                                            isSubmitting || loading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                                        }`}
                                    >
                                        {isSubmitting || loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing Soil Data...
                                            </span>
                                        ) : "Analyze My Soil"}
                                    </button>
                                    
                                    <p className="text-center text-xs text-slate-500 mt-3">
                                        Our AI will analyze your inputs and provide personalized recommendations
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                ) : (
                    // Chat-style result section
                    <div className="w-full flex justify-center items-center min-h-[60vh]">
                        <div className="w-full max-w-2xl bg-white/95 p-8 rounded-2xl shadow-xl border border-green-100 flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MdAnalytics className="text-green-600 text-2xl" />
                                <h2 className="text-2xl font-bold text-green-700">Soil Analysis Chat</h2>
                            </div>
                            <div className="flex flex-col gap-6">
                                {/* User message */}
                                <div className="flex gap-3 items-start">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-lg">U</div>
                                    <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 text-slate-800 max-w-xl">
                                        <span className="font-semibold">You:</span> Submitted soil data for analysis.
                                    </div>
                                </div>
                                {/* AI response */}
                                <div className="flex gap-3 items-start">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center font-bold text-white text-lg">AI</div>
                                    <div className="bg-gradient-to-br from-green-100 to-green-50 border border-green-200 rounded-xl px-5 py-3 text-green-900 max-w-xl whitespace-pre-line">
                                        <span className="font-semibold">AgriTech AI:</span>
                                        <div className="mt-2 text-base leading-relaxed">{report.answer}</div>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="self-end mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md transition-all"
                                onClick={() => { setIsReportVisible(false); setReport({ answer: '' }); }}
                            >
                                Analyze Another Soil Sample
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SoilDiagnosis;







