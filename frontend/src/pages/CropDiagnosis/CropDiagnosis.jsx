import React, { useState, useEffect } from "react";
import { 
  MdOutlineAddAPhoto, 
  MdAnalytics, 
  MdOutlineScience 
} from "react-icons/md";
import { 
  FaCloudUploadAlt, 
  FaArrowRight, 
  FaLeaf, 
  FaSeedling 
} from "react-icons/fa";
import { GiPlantSeed, GiWheat, GiCorn } from "react-icons/gi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function CropDiagnosis() {
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionText, setPredictionText] = useState('');
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.user.userInfo);
  
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictionText(""); // Clear previous results

    const formData = new FormData();
    // Ensure we grab the file correctly
    const fileInput = document.getElementById('image');
    formData.append('file', fileInput.files[0]);
    
    try {
      const response = await fetch('http://localhost:5124/predict', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.error) {
        setPredictionText(`Error: ${data.error}`);
      } else {
        // This will display the formatted text we created in Python
        setPredictionText(data.prediction_text);
      }
    } catch (error) {
      console.error("Error diagnosing crop:", error);
      setPredictionText("Network error. Please ensure the backend is running.");
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
        <GiPlantSeed size={80} />
      </div>
      <div className="absolute bottom-[20%] left-[5%] text-green-200 opacity-10 animate-float-medium">
        <GiWheat size={70} />
      </div>
      <div className="absolute top-[60%] right-[8%] text-amber-100 opacity-15 animate-float-slow">
        <GiCorn size={60} />
      </div>
      
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 relative inline-block">
            Crop Disease Diagnosis
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4">
            Upload images of your crops to identify diseases and receive tailored treatment recommendations from our AI analysis system.
          </p>
        </div>
        
        <div className="w-full">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/95 p-8 rounded-2xl shadow-xl border border-green-100 mb-8 relative overflow-hidden"
            style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.08)' }}
          >
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700 font-medium mb-4">
                  <MdOutlineAddAPhoto className="text-green-600 text-2xl" />
                  <h2 className="text-xl font-semibold">Upload Crop Image</h2>
                </div>
                
                <div className="border-2 border-dashed border-green-200 rounded-xl overflow-hidden bg-green-50/30 transition-all hover:border-green-300">
                  <div className="relative w-full aspect-video flex flex-col justify-center items-center cursor-pointer">
                    {imagePreview ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={imagePreview} 
                          alt="Crop preview" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex justify-center items-center">
                          <label htmlFor="image" className="cursor-pointer">
                            <div className="bg-white/90 rounded-full p-3 transform hover:scale-110 transition-transform">
                              <MdOutlineAddAPhoto className="text-green-600 text-2xl" />
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="image" className="cursor-pointer flex flex-col items-center py-10 px-4">
                        <FaCloudUploadAlt className="text-green-500 text-5xl mb-4" />
                        <p className="text-slate-600 text-center mb-2">Drag and drop your image here or click to browse</p>
                        <p className="text-xs text-slate-500">(Supported formats: JPG, JPEG, PNG)</p>
                        <div className="mt-4">
                          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white inline-flex items-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5">
                            <FaSeedling className="text-green-100" /> 
                            Select Image
                          </span>
                        </div>
                      </label>
                    )}
                    <input
                      className="hidden" 
                      type="file" 
                      id="image" 
                      name="file" 
                      accept=".jpg, .jpeg, .png" 
                      required 
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading || !imagePreview}
                    className={`relative px-8 py-3 rounded-lg text-white font-medium transition-all flex items-center gap-2
                      ${loading || !imagePreview 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Image...
                      </span>
                    ) : (
                      <>
                        Diagnose Crop <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
          
          {/* Results Section */}
          {(predictionText || loading) && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 p-8 rounded-2xl shadow-xl border border-green-100 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <MdAnalytics className="text-green-600 text-2xl" />
                <h2 className="text-xl font-bold text-green-700">Diagnosis Results</h2>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 animate-pulse">Analyzing your crop image...</p>
                </div>
              ) : (
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-900 w-full">
                    <div className="flex items-center mb-2">
                      <MdOutlineScience className="text-green-600 mr-2" />
                      <span className="font-semibold">Diagnosis:</span>
                    </div>
                    <div className="mt-1 text-base leading-relaxed whitespace-pre-wrap">
                      {predictionText}
                    </div>
                  </div>
                </div>
              )}
              
              {!loading && predictionText && (
                <div className="mt-6 pt-4 border-t border-green-100">
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-amber-800 flex items-center">
                      <FaLeaf className="mr-2" /> Treatment Recommendation
                    </h3>
                    <p className="mt-1 text-sm text-amber-700">
                      For additional treatment recommendations and advice, consider sharing this diagnosis with our farming community.
                    </p>
                    <div className="mt-3">
                      <button className="px-4 py-2 text-xs font-medium text-amber-800 bg-amber-100 rounded-md hover:bg-amber-200 transition-colors">
                        Share with Community
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Don't remove - this spacer ensures the footer appears properly */}
      <div className="h-16"></div>
    </motion.div>
  );
}

export default CropDiagnosis;