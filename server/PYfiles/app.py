# server/PYfiles/app.py

import os
import logging
import random
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

# --- Configuration ---
load_dotenv()
app = Flask(__name__)

# --- PRODUCTION-READY CORS SETUP ---
# Fetch allowed origins from env, default to local Vite frontend
allowed_origins_raw = os.getenv("CORS_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS = allowed_origins_raw.split(",")

# Initialize CORS with robust settings
CORS(app, 
    resources={r"/*": {"origins": ALLOWED_ORIGINS}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"]
)

# Logging Setup
logging.basicConfig(level=logging.INFO)
logger = app.logger
logger.info(f"CORS enabled for origins: {ALLOWED_ORIGINS}")

# --- Key Management System ---
class KeyManager:
    def __init__(self):
        # 1. Load all keys starting with GOOGLE_API_KEY_
        self.keys = [
            val for key, val in os.environ.items() 
            if key.startswith("GOOGLE_API_KEY") and val
        ]
        if not self.keys:
            logger.error("No GOOGLE_API_KEYs found in .env!")
            raise ValueError("No Google API Keys configured.")
        
        logger.info(f"Loaded {len(self.keys)} Gemini API keys.")

    def get_random_key(self):
        """Returns a random key from the pool."""
        return random.choice(self.keys)

    def configure_random_key(self):
        """Configures the global genai object with a random key."""
        key = self.get_random_key()
        genai.configure(api_key=key)
        return key

# Initialize Key Manager
key_manager = KeyManager()
HF_API_KEY = os.getenv("HF_API_KEY")

# Hugging Face URL
CROP_API_URL = "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

# --- Helper: Safe Gemini Caller ---
def call_gemini_safe(content_parts, system_instruction=None, retries=3):
    """
    Tries to call Gemini. If rate limited, switches keys and retries.
    """
    attempt = 0
    last_error = None

    while attempt < retries:
        try:
            # 1. Switch Key before every attempt
            current_key = key_manager.configure_random_key()
            
            # 2. Setup Model
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # 3. Generate
            # We pass the system instruction inside the prompt context if needed, 
            # or simplify by just sending the parts.
            response = model.generate_content(content_parts)
            return response.text

        except google_exceptions.ResourceExhausted as e:
            # 4. Handle Rate Limits (429)
            logger.warning(f"Key ...{current_key[-4:]} exhausted. Switching key. (Attempt {attempt+1}/{retries})")
            attempt += 1
            last_error = e
            time.sleep(1) # Brief pause to let things settle

        except Exception as e:
            # Other errors (like network) might not be solved by key switching, but we retry anyway just in case
            logger.error(f"Gemini Error: {e}")
            attempt += 1
            last_error = e
            
    # If we run out of retries
    raise last_error

# --- Feature 1: Crop Diagnosis (Hugging Face) ---
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
            "treatment": treatment,
            "prediction_text": f"{readable_label}: {treatment}"
        })

    except Exception as e:
        logger.error(f"Crop Error: {e}")
        return jsonify({"error": str(e)}), 500


# --- Feature 2: Soil Diagnosis (With Key Rotation) ---
@app.route("/report", methods=["POST"])
def soil_report():
    if "file" not in request.files or "formData" not in request.form:
        return jsonify({"error": "Missing PDF or Form Data"}), 400
        
    try:
        pdf_file = request.files["file"]
        form_data = request.form["formData"]
        pdf_bytes = pdf_file.read()

        # Construct the detailed prompt
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
        * **pH Level:** [Value] ([Status])
        * **Nutrients:** N: [Value], P: [Value], K: [Value]
        
        ## ⚠️ Critical Deficiencies
        * [List deficiencies]
        
        ## 💡 Expert Recommendations
        * [Specific advice]
        """
        
        # Prepare content parts (PDF + Prompt)
        content = [
            {"mime_type": "application/pdf", "data": pdf_bytes},
            prompt
        ]
        
        # CALL WITH ROTATION & RETRY
        result_text = call_gemini_safe(content)
        
        return jsonify({"result": result_text})

    except Exception as e:
        logger.error(f"Soil Analysis Failed: {e}")
        return jsonify({"error": "Failed to analyze report after multiple retries"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)