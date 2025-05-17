import os
import uuid
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from huggingface_hub import InferenceClient

# --- Configuration & Initialization ---
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY", "").strip()
if not HF_API_KEY:
    raise RuntimeError("HF_API_KEY not set in environment")

# High-accuracy plant disease model (EfficientNetB4 fine-tuned on PlantVillage)
MODEL_ID = "liriope/PlantDiseaseDetection"

# Instantiate per HF docs: provider + api_key
client = InferenceClient(
    provider="hf-inference",       # routes through Hugging Face’s Inference API :contentReference[oaicite:0]{index=0}
    api_key=HF_API_KEY             # your user access token
)

BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.update(
        UPLOAD_FOLDER=UPLOAD_FOLDER,
        MAX_CONTENT_LENGTH=MAX_CONTENT_LENGTH
    )

    # Structured logging
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(handler)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify(status="ok"), 200

    def allowed_file(filename: str) -> bool:
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

    def query_hf(img_bytes: bytes) -> dict:
        """
        Calls image_classification per the InferenceClient signature:
        image_classification( image: Union[bytes, str, Path], model: Optional[str], top_k: Optional[int] )
        :contentReference[oaicite:1]{index=1}
        """
        try:
            preds = client.image_classification(
                img_bytes,           # raw bytes as first positional arg
                model=MODEL_ID,      # explicit model on each call
                top_k=1              # just the top prediction
            )
            return {"data": preds}
        except Exception as e:
            app.logger.error("HF inference error", exc_info=True)
            return {"error": str(e)}

    @app.route("/predict", methods=["POST"])
    def predict():
        f = request.files.get("file")
        if not f or f.filename == "":
            return jsonify(error="No file provided"), 400
        if not allowed_file(f.filename):
            return jsonify(error="Unsupported file type"), 415

        filename = secure_filename(f.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)

        try:
            f.save(file_path)
            app.logger.info(f"Saved upload to {file_path}")

            # Always read bytes, never pass the path string directly
            with open(file_path, "rb") as img_f:
                img_bytes = img_f.read()

            result = query_hf(img_bytes)
            if "error" in result:
                return jsonify(error=result["error"]), 502

            data = result["data"]
            if isinstance(data, list) and data:
                top = data[0]
                label = top.get("label")
                score = top.get("score")
                if label is not None and score is not None:
                    return jsonify(label=label, score=score), 200

            return jsonify(error="Unexpected response format"), 502

        finally:
            try:
                os.remove(file_path)
                app.logger.debug(f"Removed temp file {file_path}")
            except OSError:
                pass

    return app

if __name__ == "__main__":
    app = create_app()
    app.logger.info("Starting Plant Disease API on port 5124")
    app.run(host="0.0.0.0", port=5124, debug=False)
