
import os
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# --- Configuration ---
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

# NEW ROUTER URL (Mandatory fix for 410 Error)
API_URL = "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

app = Flask(__name__)
CORS(app)

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = app.logger

# --- Helper: Treatment Logic ---
def get_treatment(disease_label):
    treatments = {
        "Tomato_Late_blight": "Apply copper-based fungicides. Remove infected leaves immediately.",
        "Tomato_Early_blight": "Improve air circulation. Apply fungicides with chlorothalonil.",
        "Tomato_Healthy": "Your plant looks great! Keep up the regular watering schedule.",
        "Potato_Late_blight": "Destroy infected tubers. Use resistant varieties.",
        "Corn_Common_rust": "Plant resistant hybrids. Apply fungicides if infection is severe.",
        "default": "Consult a local agricultural expert. Ensure proper drainage and remove infected parts."
    }
    if disease_label in treatments:
        return treatments[disease_label]
    return treatments["default"]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "API is running"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # 1. READ BYTES
        image_bytes = file.read()
        
        if not image_bytes:
             return jsonify({"error": "File is empty"}), 400

        logger.info(f"Sending {len(image_bytes)} bytes to Hugging Face Router...")

        # 2. PREPARE REQUEST WITH HEADERS
        # Content-Type is CRITICAL to avoid 400 Bad Request
        headers = {
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/octet-stream" 
        }

        # 3. SEND TO NEW ROUTER URL
        response = requests.post(API_URL, headers=headers, data=image_bytes)

        # 4. HANDLE ERRORS
        if response.status_code != 200:
            logger.error(f"Router Error ({response.status_code}): {response.text}")
            return jsonify({"error": f"AI Error: {response.text}"}), response.status_code

        # 5. PARSE RESPONSE
        predictions = response.json()
        
        if not predictions or (isinstance(predictions, dict) and "error" in predictions):
             return jsonify({"error": "Invalid response from AI"}), 500
             
        # Normalize list vs dict response
        top_result = predictions[0] if isinstance(predictions, list) else predictions
        
        label = top_result.get("label", "Unknown")
        score = top_result.get("score", 0)

        # 6. RETURN SUCCESS
        readable_label = label.replace("_", " ").replace("  ", " ").strip()
        treatment = get_treatment(label)
        
        prediction_text = (
            f"Diagnosis: {readable_label}\n"
            f"Confidence: {score:.1%}\n\n"
            f"Recommended Treatment: {treatment}"
        )

        return jsonify({
            "prediction_text": prediction_text,
            "disease": readable_label,
            "confidence": score
        })

    except Exception as e:
        logger.error(f"Server Error: {str(e)}")
        return jsonify({"error": f"Internal Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5124, debug=True)