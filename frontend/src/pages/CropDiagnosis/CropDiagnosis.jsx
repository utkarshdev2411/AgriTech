
import React, { useState } from "react";

function CropDiagnosis() {
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionText, setPredictionText] = useState(''); // Add this line
  const [loading,setLoading]=useState(false)

  const handleChange = (e) => {
    const file = e.target.files[0];
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
    setLoading(true) // changed loading
    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);
    const response = await fetch('http://localhost:5124/predict', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setPredictionText(data.prediction_text); // Update the prediction text
    setLoading(false) // changed loading
  };

  return (
    <div className="sm:w-[80%] max-w-2xl mx-4 sm:m-auto">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h1 className="text-2xl font-bold">Username</h1>
        <h2 className="text-xl my-2 font-semibold">
          Upload image to get the best result:
        </h2>
        <div className="w-full border border-black h-[15rem] sm:h-[20rem] rounded-xl overflow-hidden m-auto">
          <div className="flex justify-center items-center h-full w-full relative">
            {imagePreview && (
              <img src={imagePreview} alt="image" className="h-full w-full" />
            )}

            <div
              className={`absolute ${imagePreview ? "bottom-0 right-0 m-3" : ""
                }`}
            >
              <label htmlFor="image">
              
                <div className="border border-blue-950 bg-purple-700 p-2 px-4 rounded-md text-white cursor-pointer">
                  <i className="fa-solid fa-arrow-up-from-bracket"></i> {imagePreview ? 'Edit' : 'Upload'}
                </div>
               
              </label>
              <input
               className="hidden" type="file" id="image" name="file" accept=".jpg, .jpeg, .png" required="required" onChange={handleChange}
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
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-xl my-2  font-semibold">Result:</h2>
        {loading?
      <img  className=" border border-gray-400 p-10" src={"https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=6c09b9520qwkh1x7cxjjd5lr3xt43g99jzpye40tzein23u4&ep=v1_gifs_search&rid=200w.gif&ct=g" } alt="" />:
        <textarea
          name="problem"
          id="problem"
          rows={5}
          className="w-full border border-gray-400 outline-none p-4"
          placeholder="Upload the image and click the predict button to get the result..."
          readOnly
          value={predictionText} // Use the prediction text state variable here
        />}
      </div>
    </div>
  );
}

export default CropDiagnosis;