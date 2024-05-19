import os
import requests
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
from flask import jsonify
from flask_cors import CORS




# Initialize the Flask app
flask_app = Flask(__name__)
CORS(flask_app)

# Configure the upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
flask_app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Hugging Face API configuration
API_URL = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
HEADERS = {"Authorization": "Bearer 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"}

# Function to query the Hugging Face API
def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=HEADERS, data=data)
    return response.json()

# @flask_app.route("/")
# def home():
#     return render_template("index.html")

# @flask_app.route("/predict", methods=["POST"])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({'prediction_text': 'No image selected'})

#     file = request.files['file']

#     if file.filename == '':
#         return render_template('index.html', prediction_text='No image selected')

#     if file:
#         filename = secure_filename(file.filename)
#         file_path = os.path.join(flask_app.config['UPLOAD_FOLDER'], filename)
#         file.save(file_path)

#         # Make prediction
#         output = query(file_path)
#         if output:
#             predicted_label = output[0]['label'] +'\n'+ 'predicted score is :' + str(output[0]['score'])
#             # predicted_label = output
#             result_text = f"Prediction: {predicted_label}"
#         else:
#             result_text = "Failed to get prediction from API"

#         return render_template("index.html", prediction_text=result_text)


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
        if output:
            predicted_label = output[0]['label'] +'\n'+ 'predicted score is :' + str(output[0]['score'])
            # predicted_label = output
            result_text = f"Prediction: {predicted_label}"
        else:
            result_text = "Failed to get prediction from API"

        return jsonify({"prediction_text": result_text})

print('*************************************************************************************************')

print('*************************************************************************************************')


if __name__ == "__main__":

    flask_app.run(debug=True, host='0.0.0.0', port=5123)

