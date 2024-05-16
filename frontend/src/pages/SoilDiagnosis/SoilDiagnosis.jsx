import React, { useState } from "react";

function SoilDiagnosis() {
  const [imagePreview, setImagePreview] = useState(null);

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
  return (
    <div className="sm:w-[80%] m-auto">
      <div className="flex flex-wrap">
        <div className=" w-full sm:w-[35%] border border-black my-4 mx-8 sm:my-8 h-[10rem] sm:h-[20rem]  rounded-xl overflow-hidden">
          <div className="flex justify-center items-center h-full w-full relative">
            {imagePreview && <img src={imagePreview} alt="image" className="h-full w-full"/>}

            <div className={`absolute ${imagePreview ? 'bottom-0 right-0 m-3': ''}`}>
              <label htmlFor="image">
                <div className="border border-blue-950 bg-purple-700 p-2 px-4 rounded-md text-white cursor-pointer">
                  <i class="fa-solid fa-arrow-up-from-bracket"></i> {imagePreview ? 'Edit': 'Upload'}
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
        <div className="my-4 mx-8 sm:my-8 w-full sm:w-[44%]"> 
            <h1 className="text-2xl font-bold">Username</h1>
            <h2 className="text-xl my-2">Problem</h2>
            <textarea name="problem" id="problem" rows={5} className="w-full border border-gray-400 outline-none p-4" placeholder="Description"></textarea>
        </div>
      </div>
    </div>
  );
}

export default SoilDiagnosis;
