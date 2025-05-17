import os
import requests
import time
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Initialize the Flask app
flask_app = Flask(__name__)
CORS(flask_app, resources={r"/*": {"origins": ["http://localhost:5173", "*"]}})

# Configure the upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
flask_app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
Hf_api_key=os.getenv("HF_API_KEY")
# Hugging Face API configuration
API_URL = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
HEADERS = {"Authorization": "Bearer " + Hf_api_key}

# Function to query the Hugging Face API with retry mechanism
def query(filename, max_retries=5, retry_delay=2):
    """
    Query the Hugging Face API with retries for model loading
    
    Args:
        filename: Path to the image file
        max_retries: Maximum number of retry attempts
        retry_delay: Delay between retries in seconds
        
    Returns:
        JSON response or error message
    """
    with open(filename, "rb") as f:
        data = f.read()
    
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=HEADERS, data=data)
            
            # Check if we got a successful response
            if response.status_code == 200:
                return response.json()
            
            # Check for model loading message
            error_text = response.text
            print(f"Attempt {attempt+1}: Status code: {response.status_code}, Response: {error_text}")
            
            if "loading" in error_text.lower() or "currently loading" in error_text.lower():
                print(f"Model is loading, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                continue
                
            # If it's another error, return it as a dictionary
            return {"error": error_text}
            
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return {"error": f"API request failed: {str(e)}"}
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Raw response: {response.text}")
            
            # If it's the first attempt, try again as the model might be loading
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                return {"error": "Invalid response format from API"}
    
    return {"error": "Maximum retries reached"}

@flask_app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({'prediction_text': 'No image selected'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'prediction_text': 'No image selected'})

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(flask_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Make prediction
        output = query(file_path)
        
        # Check if we have a valid prediction
        if isinstance(output, list) and len(output) > 0 and 'label' in output[0]:
            predicted_label = output[0]['label'] + '\n' + 'predicted score is: ' + str(output[0]['score'])
            result_text = f"Prediction: {predicted_label}"
        elif 'error' in output:
            result_text = f"API Error: {output['error']}"
        else:
            result_text = "Failed to get prediction from API"

        return jsonify({"prediction_text": result_text})

if __name__ == "__main__":
    print('*************************************************************************************************')
    print('Plant Disease Diagnosis API server running on port 5124')
    print('*************************************************************************************************')
    flask_app.run(debug=True, host='0.0.0.0', port=5124)

