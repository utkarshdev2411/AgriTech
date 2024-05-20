import React, { useState, useEffect } from "react";

const LinksModal = ({ isOpen, onClose, links, setLinks }) => {
  const [editedLinks, setEditedLinks] = useState({
    youtube: "",
    facebook: "",
    instagram: "",
    twitter: "",
    other: "",
  });

  useEffect(() => {
    if (links) {
      setEditedLinks({
        youtube: links.youtube || "",
        facebook: links.facebook || "",
        instagram: links.instagram || "",
        twitter: links.twitter || "",
        other: links.other || "",
      });
    }
  }, [links]);

  const handleInputChange = (name, value) => {
    setEditedLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  const saveLinks = (e) => {
    e.preventDefault(); // Prevent form submission
    setLinks(editedLinks);
    onClose();
  };

  const close = () => {
    onClose();
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? "" : "hidden"}`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-[90%] max-w-md">
          <div className="bg-slate-400 px-4 pt-5 pb-4 ">
            <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
              <h3 className="text-lg leading-6 font-medium mb-4 text-black mx-2">
                Add Links
              </h3>

              {["youtube", "facebook", "instagram", "twitter", "other"].map(
                (type) => (
                  <div className="mb-4" key={type}>
                    <div className="flex flex-col">
                      <label
                        className="inline-block mb-1 pl-2 w-full"
                        htmlFor={type}
                      >
                        {type}:
                      </label>
                      <input
                        id={type}
                        type="text"
                        className="mx-2 bg-white outline-none border-2 border-gray-200 text-black rounded-lg px-3 py-1 focus:bg-gray-100"
                        value={editedLinks[type]}
                        placeholder={`Enter your ${type} url`}
                        onChange={(e) =>
                          handleInputChange(type, e.target.value)
                        }
                      />
                    </div>
                  </div>
                )
              )}

              <div className="flex justify-end">
                <button
                  onClick={close}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Close
                </button>
                <button
                  onClick={saveLinks}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Links
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksModal;
