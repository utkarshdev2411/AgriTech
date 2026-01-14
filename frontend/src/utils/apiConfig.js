// frontend/src/utils/apiConfig.js

// 1. Node.js Backend URL (Users, Posts, Community)
export const MAIN_API = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// 2. Python AI Backend URL (Crop & Soil Diagnosis)
export const AI_API = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:5000";
