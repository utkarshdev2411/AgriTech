import os
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient

# --- Configuration ---
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_ID = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

app = Flask(__name__)
CORS(app)

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = app.logger

# Initialize InferenceClient with the router provider
client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_KEY
)

# --- Helper: Treatment Logic ---
def get_treatment(disease_label):
    """
    Map diseases to treatments.
    """
    treatments = {
        "Tomato_Late_blight": "Apply copper-based fungicides. Remove infected leaves immediately.",
        "Tomato_Early_blight": "Improve air circulation. Apply fungicides with chlorothalonil.",
        "Tomato_Healthy": "Your plant looks great! Keep up the regular watering schedule.",
        "Potato_Late_blight": "Destroy infected tubers. Use resistant varieties.",
        "Corn_Common_rust": "Plant resistant hybrids. Apply fungicides if infection is severe.",
        "Apple_Apple_scab": "Remove fallen leaves. Apply fungicides during wet periods.",
        "Apple_Black_rot": "Prune infected branches. Apply fungicides in early spring.",
        "Apple_Cedar_apple_rust": "Remove nearby cedar trees. Apply fungicides preventively.",
        "Grape_Black_rot": "Remove mummified fruit. Apply fungicides before bloom.",
        "Grape_Esca_(Black_Measles)": "Prune infected wood. Improve drainage and air circulation.",
        "Peach_Bacterial_spot": "Use copper sprays. Plant resistant varieties.",
        "Pepper_Bacterial_spot": "Rotate crops. Use disease-free seeds.",
        "Strawberry_Leaf_scorch": "Remove infected leaves. Improve air circulation.",
        # Add a default fallback
        "default": "Consult a local agricultural expert. Ensure proper drainage and remove infected parts."
    }
    return treatments.get(disease_label, treatments["default"])

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
        # 1. READ FILE BYTES
        image_bytes = file.read()
        
        # 2. SEND TO HUGGING FACE VIA ROUTER
        # The InferenceClient with hf-inference provider handles bytes
        try:
            predictions = client.image_classification(
                image_bytes,
                model=MODEL_ID
            )
            
        except Exception as hf_error:
            logger.error(f"HF Inference Error: {str(hf_error)}")
            return jsonify({
                "error": f"AI Model Error: {str(hf_error)}",
                "prediction_text": "The AI model encountered an error. Please try again."
            }), 503

        # 3. PARSE RESPONSE
        # The API returns a list of objects
        if not predictions or not isinstance(predictions, list):
            return jsonify({"error": "No predictions returned"}), 500

        top_result = predictions[0]
        # Access as dict keys
        label = top_result.get('label', 'Unknown')
        score = top_result.get('score', 0)

        # 4. FORMAT RESPONSE
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
        return jsonify({"error": "Internal server error processing image"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5124, debug=True)