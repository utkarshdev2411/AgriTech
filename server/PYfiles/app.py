# server/PYfiles/app.py

import os
import logging
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# --- Configuration ---
load_dotenv()
app = Flask(__name__)
CORS(app) # Allow frontend access

# 1. API KEYS
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

# 2. CONFIGURE GEMINI (Native PDF Support)
genai.configure(api_key=GOOGLE_API_KEY)
SOIL_MODEL = genai.GenerativeModel('gemini-2.5-flash')

# 3. CONFIGURE CROP AI (Hugging Face)
CROP_API_URL = "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = app.logger

# --- Feature 1: Crop Diagnosis ---
def get_crop_treatment(disease_label):
    treatments = {
        "Tomato_Late_blight": "Apply copper-based fungicides. Remove infected leaves immediately.",
        "Tomato_Early_blight": "Improve air circulation. Apply fungicides with chlorothalonil.",
        "Tomato_Healthy": "Your plant looks great! Keep up the regular watering schedule.",
        "Potato_Late_blight": "Destroy infected tubers. Use resistant varieties.",
        "Corn_Common_rust": "Plant resistant hybrids. Apply fungicides if infection is severe.",
        "default": "Consult a local agricultural expert. Ensure proper drainage and remove infected parts."
    }
    return treatments.get(disease_label, treatments["default"])

@app.route("/predict", methods=["POST"])
def crop_predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    try:
        file = request.files["file"]
        image_bytes = file.read()
        
        # Call Hugging Face
        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/octet-stream"
        }
        response = requests.post(CROP_API_URL, headers=headers, data=image_bytes)
        
        if response.status_code != 200:
            return jsonify({"error": "AI Model Error"}), 503

        predictions = response.json()
        top = predictions[0] if isinstance(predictions, list) else predictions
        
        label = top.get("label", "Unknown")
        score = top.get("score", 0)
        
        readable_label = label.replace("_", " ").strip()
        treatment = get_crop_treatment(label)
        
        return jsonify({
            "disease": readable_label,
            "confidence": score,
            "treatment": treatment, # Sending separate fields for better UI
            "prediction_text": f"{readable_label}: {treatment}" # Backward compatibility
        })

    except Exception as e:
        logger.error(f"Crop Error: {e}")
        return jsonify({"error": str(e)}), 500


# --- Feature 2: Soil Diagnosis (The Optimized Flow) ---
@app.route("/report", methods=["POST"])
def soil_report():
    if "file" not in request.files or "formData" not in request.form:
        return jsonify({"error": "Missing PDF or Form Data"}), 400
        
    try:
        pdf_file = request.files["file"]
        form_data = request.form["formData"] # User input (Location, Crop type, etc.)
        pdf_bytes = pdf_file.read()

        # THE MAGIC: Sending raw PDF bytes directly to Gemini 1.5 Flash
        # No RAG, No VectorDB, No Poppler needed.
        prompt = f"""
        You are an expert agronomist. Analyze this soil test report and the user's details.
        
        USER DETAILS:
        {form_data}
        
        TASK:
        1. Extract the pH, Nitrogen (N), Phosphorus (P), and Potassium (K) levels.
        2. Compare them to ideal levels for the crop mentioned in user details.
        3. Provide specific fertilizer recommendations.
        
        OUTPUT FORMAT (Strict Markdown):
        ## 📊 Soil Status
        * **pH Level:** [Value] ([Status: Acidic/Neutral/Alkaline])
        * **Nutrients:** N: [Value], P: [Value], K: [Value]
        
        ## ⚠️ Critical Deficiencies
        * [List deficiencies or "None"]
        
        ## 💡 Expert Recommendations
        * [Specific advice based on the PDF data]
        """
        
        response = SOIL_MODEL.generate_content([
            {"mime_type": "application/pdf", "data": pdf_bytes},
            prompt
        ])
        
        return jsonify({"answer": response.text})

    except Exception as e:
        logger.error(f"Soil Error: {e}")
        return jsonify({"error": f"Failed to analyze report: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)