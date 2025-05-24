import os
import uuid
import io
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import requests
import logging
import tensorflow as tf

# --- Configuration & Initialization ---
load_dotenv()
API_URL = "https://api-inference.huggingface.co/models/chaiyanabe/plant-disease-squeeze"
HF_API_KEY = os.getenv("HF_API_KEY", "")

# Setup headers for huggingface API calls
headers = {"Authorization": f"Bearer {HF_API_KEY}"} if HF_API_KEY else {}

# Setup Flask app
app = Flask(__name__)
app.logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
app.logger.addHandler(handler)

CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "*"]}})

# Configure file upload settings
BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads", "crops")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB

# --- Helper functions ---
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def query_huggingface(image_bytes):
    """
    Send image to Hugging Face for prediction using a plant disease classification model
    """
    try:
        response = requests.post(
            API_URL,
            headers=headers,
            data=image_bytes
        )
        # Check if request was successful
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        app.logger.error(f"HTTP error from Hugging Face API: {str(e)}")
        return {"error": f"Hugging Face API error: {str(e)}"}
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error connecting to Hugging Face API: {str(e)}")
        return {"error": f"Connection error: {str(e)}"}
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return {"error": f"Unexpected error: {str(e)}"}

def fallback_prediction(image_bytes):
    """
    Fallback method using TensorFlow Lite model if Hugging Face API is unavailable
    """
    try:
        # Path to TF Lite model
        model_path = os.path.join(BASE_DIR, "models", "plant_disease_model.tflite")
        
        # Check if model exists
        if not os.path.exists(model_path):
            app.logger.error("TensorFlow Lite model not found")
            return {"error": "Fallback model not available"}
        
        # Load the TFLite model
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()

        # Get input and output tensors
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        # Process image
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize((224, 224))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Set the input tensor
        interpreter.set_tensor(input_details[0]['index'], img_array)
        
        # Run inference
        interpreter.invoke()
        
        # Get the output tensor
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        # Get the predicted class
        class_idx = np.argmax(output_data)
        confidence = output_data[0][class_idx]
        
        # Map class index to disease name
        # This would need to be populated with your model's classes
        diseases = ["Healthy", "Disease_1", "Disease_2", "Disease_3"]
        if class_idx < len(diseases):
            return [{
                "label": diseases[class_idx],
                "score": float(confidence)
            }]
        else:
            return {"error": "Unknown prediction class"}
            
    except Exception as e:
        app.logger.error(f"Error in fallback prediction: {str(e)}")
        return {"error": f"Fallback prediction error: {str(e)}"}

# --- Routes ---
@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200

@app.route("/predict", methods=["POST"])
def predict():
    """
    Process uploaded crop image and return disease diagnosis
    """
    # Check if file exists
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files["file"]
    
    # Check if filename is empty
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not supported. Please upload JPG, JPEG or PNG images"}), 415

    # Save file with secure filename
    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)
    
    try:
        # Save the file
        file.save(file_path)
        app.logger.info(f"Saved crop image to {file_path}")
        
        # Read the file as bytes for inference
        with open(file_path, "rb") as img_file:
            img_bytes = img_file.read()
        
        # Try Hugging Face API first
        predictions = query_huggingface(img_bytes)
        
        # Check if there was an error with Hugging Face
        if isinstance(predictions, dict) and "error" in predictions:
            app.logger.warning(f"Hugging Face API error: {predictions['error']}. Trying fallback...")
            # Try fallback prediction
            predictions = fallback_prediction(img_bytes)
        
        # Check if we have a valid prediction
        if isinstance(predictions, list) and predictions:
            top_prediction = predictions[0]
            label = top_prediction.get("label", "Unknown")
            score = top_prediction.get("score", 0)
            
            # Format label for better readability
            formatted_label = label.replace("_", " ").title()
            
            # Create treatment recommendations based on the diagnosis
            treatment_text = get_treatment_recommendation(label)
            
            response_data = {
                "prediction_text": f"Your crop appears to have {formatted_label} with {score:.1%} confidence.\n\n{treatment_text}",
                "disease": formatted_label,
                "confidence": float(score),
                "image_path": unique_name
            }
            
            return jsonify(response_data)
        else:
            return jsonify({"error": "Could not generate a prediction", 
                           "prediction_text": "Sorry, we encountered an error analyzing your crop. Please try again."}), 500
            
    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}", exc_info=True)
        return jsonify({"prediction_text": f"Sorry, we encountered an error analyzing your crop. Please try again.",
                       "error": str(e)}), 500

def get_treatment_recommendation(disease_label):
    """
    Return treatment recommendations based on detected disease
    """
    # Dictionary of common plant diseases and their treatments
    treatments = {
        "Tomato Late Blight": "Apply copper-based fungicides early when conditions favor disease. Ensure proper spacing between plants for good air circulation. Remove and destroy infected leaves and plants.",
        
        "Tomato Early Blight": "Apply fungicides containing chlorothalonil or copper. Mulch around the base of plants. Prune lower leaves to improve air circulation.",
        
        "Tomato Healthy": "Your tomato plant appears healthy! Continue regular watering and fertilization schedules.",
        
        "Potato Late Blight": "Apply fungicides containing copper or chlorothalonil. Remove infected plants immediately to prevent spread. Consider resistant varieties for future plantings.",
        
        "Potato Early Blight": "Apply fungicides and ensure proper plant spacing. Rotate crops annually and remove plant debris after harvest to reduce overwintering of the pathogen.",
        
        "Corn Common Rust": "Apply fungicides containing azoxystrobin or pyraclostrobin. Plant resistant varieties. Ensure proper field drainage.",
        
        "Apple Scab": "Apply fungicides before and during rainy periods. Rake and destroy fallen leaves to reduce overwintering of the fungus.",
        
        "Apple Black Rot": "Prune out dead or diseased wood during dormant season. Apply fungicides during the growing season.",
        
        # Add more diseases and treatments as needed
    }
    
    # Clean up the disease label for matching
    clean_label = disease_label.replace("_", " ").title()
    
    # Return specific treatment if available, otherwise a general recommendation
    return treatments.get(clean_label, 
        "Consult with a local agricultural extension office for specific treatment recommendations. " 
        "Generally, remove infected parts, ensure good air circulation, and consider appropriate fungicides or treatments."
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5124, debug=False)