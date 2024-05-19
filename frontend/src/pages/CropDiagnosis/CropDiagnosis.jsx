import React, { useState } from "react";
import axios from "axios";

function CropDiagnosis() {
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPrediction(`Label: ${response.data.label}, Score: ${response.data.score}`);
    } catch (error) {
      console.error('Error uploading the file:', error);
      setPrediction('Error making prediction');
    }
  };

  return (
    <div className="sm:w-[80%] max-w-2xl mx-4 sm:m-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Crop Diagnosis</h1>
        <h2 className="text-xl my-2 font-semibold">
          Upload image to get the best result:
        </h2>
        <div className="w-full border border-black h-[15rem] sm:h-[20rem] rounded-xl overflow-hidden m-auto">
          <div className="flex justify-center items-center h-full w-full relative">
            {imagePreview && (
              <img src={imagePreview} alt="image" className="h-full w-full object-cover" />
            )}
            <div className={`absolute ${imagePreview ? "bottom-0 right-0 m-3" : ""}`}>
              <label htmlFor="image">
                <div className="border border-blue-950 bg-purple-700 p-2 px-4 rounded-md text-white cursor-pointer">
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>{" "}
                  {imagePreview ? "Edit" : "Upload"}
                </div>
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:max-w-2xl my-4 px-4 py-2 rounded-md bg-slate-800 text-white font-semibold m-auto hover:bg-slate-900 active:bg-slate-700"
        >
          Predict
        </button>
      </form>
      <div>
        <h2 className="text-xl my-2 font-semibold">Result:</h2>
        <textarea
          name="problem"
          id="problem"
          rows={5}
          value={prediction}
          className="w-full border border-gray-400 outline-none p-4"
          placeholder="Upload the image and click the predict button to get the result..."
          readOnly
        ></textarea>
      </div>
    </div>
  );
}

export default CropDiagnosis;
