# Crop Diagnosis Setup Guide

## Overview
This guide will help you set up the complete end-to-end crop disease diagnosis system using Hugging Face's AI model.

## Phase 1: Hugging Face API Setup

### Step 1: Get Your API Key

1. Log in to your [Hugging Face account](https://huggingface.co/)
2. Go to **Settings** > **Access Tokens**
3. Click **Create New Token**
   - **Type:** Read
   - **Name:** `agritech-backend`
4. Copy the token (starts with `hf_...`)

### Step 2: Update Environment Variable

Open `server/.env` and add/update this line:

```env
HF_API_KEY=hf_your_copied_token_here
```

## Phase 2: Backend Setup

### Model Information
- **Model:** `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`
- **Classes:** 38 common plant diseases from PlantVillage dataset
- **Lightweight:** Fast inference, optimized for production

### What Changed in Backend:
✅ **Removed:** File storage (`os.save`, `uuid`, `UPLOAD_FOLDER`)
✅ **Added:** Direct memory reading (`file.read()`)
✅ **Updated:** Using reliable public PlantVillage model
✅ **Simplified:** Clean error handling and response format

### Install Dependencies (if needed)
```bash
cd server/PYfiles
pip install flask flask-cors python-dotenv requests
```

### Run the Backend
```bash
cd server/PYfiles
python crop_diagnosis_api.py
```

The API will start on `http://localhost:5124`

### Test the API
```bash
curl http://localhost:5124/health
```

Expected response: `{"status": "API is running"}`

## Phase 3: Frontend Setup

### What Changed:
✅ **Fixed:** File input handling to correctly grab the file
✅ **Added:** Clear error messages
✅ **Improved:** Loading states and error handling
✅ **Maintained:** Browser-only image preview (no upload until submit)

### Run the Frontend
```bash
cd frontend
npm install  # if needed
npm run dev
```

## Phase 4: Testing the Complete Flow

### Step-by-Step Test:

1. **Start Backend:**
   ```bash
   cd server/PYfiles
   python crop_diagnosis_api.py
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to:** `http://localhost:5173/cropdiagnosis`

4. **Upload Image:**
   - Click "Select Image" or drag and drop
   - Choose a plant disease image
   - Preview appears instantly (in browser memory)

5. **Click "Diagnose Crop":**
   - Loading spinner appears
   - Image sent to backend
   - Backend forwards to Hugging Face
   - Results display with:
     - Disease name
     - Confidence score
     - Treatment recommendation

## Expected Response Format

```json
{
  "prediction_text": "Diagnosis: Tomato Late blight\nConfidence: 95.2%\n\nRecommended Treatment: Apply copper-based fungicides. Remove infected leaves immediately.",
  "disease": "Tomato Late blight",
  "confidence": 0.952
}
```

## Supported Diseases (38 Classes)

The model can detect diseases in:
- **Tomato:** Late blight, Early blight, Leaf mold, Bacterial spot, etc.
- **Potato:** Late blight, Early blight
- **Corn:** Common rust, Northern Leaf Blight
- **Grape:** Black rot, Esca, Leaf blight
- **Apple:** Apple scab, Black rot, Cedar rust
- **Pepper:** Bacterial spot
- **Strawberry:** Leaf scorch
- And many more...

## Troubleshooting

### "Model is loading" error
- **Cause:** First-time model load on Hugging Face
- **Solution:** Wait 30-60 seconds and try again

### "Network error" message
- **Check:** Is backend running on port 5124?
- **Check:** Is HF_API_KEY set correctly in .env?
- **Check:** Internet connection active?

### "Invalid response from AI model"
- **Cause:** Image format or API response issue
- **Solution:** Try a different image (JPG, PNG)
- **Solution:** Check backend logs for details

## Adding More Treatments

Edit `crop_diagnosis_api.py` and add to the `treatments` dictionary:

```python
treatments = {
    "Your_Disease_Name": "Your treatment recommendation here",
    # Add more...
}
```

## Production Recommendations

1. **Rate Limiting:** Add rate limiting to prevent API abuse
2. **Image Validation:** Check image size and format before sending
3. **Caching:** Cache common predictions to reduce API calls
4. **Monitoring:** Log all predictions for analysis
5. **HTTPS:** Use HTTPS in production for security

## Security Notes

✅ **No file storage:** Images are never saved to disk
✅ **Memory only:** Images processed in RAM and discarded
✅ **API Key:** Keep HF_API_KEY secret, never commit to git
✅ **CORS:** Configure properly for production domain

## Next Steps

1. Test with various plant disease images
2. Monitor accuracy and adjust treatments
3. Gather user feedback
4. Add more disease treatments to the dictionary
5. Consider adding image validation and preprocessing

## Support

For issues:
- Check backend logs: `server/PYfiles/crop_diagnosis_api.py`
- Check browser console: Developer Tools > Console
- Verify API key is valid
- Test with the `/health` endpoint first
