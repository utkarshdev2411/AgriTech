import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LinksModal from "../../components/LinksModal";
import TextForm from "../../components/TextForm";
import {
  updateAccountAPI,
  removeAvatarAPI,
  updateAvatarAPI,
  getCurrentUserAPI,
} from "../../store/services/userAction";

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState({});

  const userInfo = useSelector((state) => state.user.userInfo);
  const loading = useSelector((state) => state.user.loading);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userInfo) {
      reset({
        fullname: userInfo.fullname,
        username: userInfo.username,
        bio: userInfo.bio || "",
        links: userInfo.links || {},
      });
      setLinks(userInfo.links || {});
    }
  }, [userInfo, reset]);

  const updateAvatar = (data) => {
    const avatarFile = data.avatarFile[0];
    if (avatarFile) {
      dispatch(updateAvatarAPI(avatarFile));
      reset();
    }
  };

  const removeAvatar = () => {
    dispatch(removeAvatarAPI());
  };

  const openModal = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateAccount = (data) => {
    data.links = links;
    console.log(data);
    dispatch(updateAccountAPI(data));
    navigate('/profile')
  };

  useEffect(() => {
    dispatch(getCurrentUserAPI());
  }, [dispatch]);

  return (
    <div className="flex justify-center">
      <div className="flex justify-center items-center flex-col w-[90%] max-w-xl">
        <h2 className="text-2xl font-bold my-2">Edit Profile</h2>

        <form
          onSubmit={handleSubmit(updateAvatar)}
          className="flex items-center justify-between py-2 px-2 border border-[#242535] rounded-xl bg-gray-200 w-full my-2"
        >
          <img
            src={userInfo?.avatar}
            alt="profile"
            className="w-16 h-16 rounded-full"
          />

          <div className="flex w-[80%]">
            <input
              type="file"
              accept="image/*"
              className="mx-2 bg-white outline-none border-2 border-[#242535] text-black rounded-lg px-3 py-1 focus:bg-gray-100 w-[85%] sm:block sm:w-[90%]"
              {...register("avatarFile")}
            />
            <button
              className="px-2 sm:px-3 py-2 mx-1 sm:mx-2 rounded-md bg-blue-500 hover:transform-gpu hover:scale-[1.02] active:bg-blue-700"
              type="submit"
            >
              Update
            </button>
            {userInfo?.avatar !==
              "https://res.cloudinary.com/avithakur/image/upload/v1714419016/user_gk9ta3.png" && (
              <button
                className="px-2 sm:px-3 py-2 mx-1 sm:mx-2 rounded-md bg-red-500 hover:transform-gpu hover:scale-[1.02] active:bg-red-700"
                onClick={removeAvatar}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col items-center justify-center py-2 px-3 border border-[#242535] rounded-xl bg-gray-200 w-full my-2">
          <form
            className="w-full max-w-sm m-2 px-2 space-y-3"
            onSubmit={handleSubmit(updateAccount)}
          >
            <div className="flex flex-col">
              <label
                className="inline-block mb-1 pl-2 w-full"
                htmlFor="fullName"
              >
                Full Name:
              </label>
              <input
                placeholder="Enter full name"
                id="fullName"
                className="mx-2 bg-white outline-none border-2 border-[#242535] text-black rounded-lg px-3 py-1 focus:bg-gray-100"
                {...register("fullname")}
              />
            </div>
            <div className="flex flex-col">
              <label
                className="inline-block mb-1 pl-2 w-full"
                htmlFor="userName"
              >
                User Name:
              </label>
              <input
                placeholder="Enter user name"
                id="userName"
                className="mx-2 bg-white outline-none border-2 border-[#242535] text-black rounded-lg px-3 py-1 focus:bg-gray-100"
                {...register("username")}
              />
            </div>

            <TextForm
              label="Bio : "
              placeholder="Enter something about you..."
              {...register("bio")}
            />

            <div>
              <button
                onClick={openModal}
                className="px-2 sm:px-3 py-2 mx-1 sm:mx-2 rounded-md ml-2 bg-green-500 hover:transform-gpu hover:scale-[1.01] hover:bg-green-600 active:bg-green-700"
              >
                Add Links
              </button>
              <LinksModal
                isOpen={isModalOpen}
                onClose={closeModal}
                links={links}
                setLinks={setLinks}
              />
            </div>

            <div>
              <button
                className="px-2 sm:px-3 py-2 mx-1 sm:mx-2 rounded-md w-[calc(100%-1rem)] ml-2 bg-blue-500 mt-4 hover:transform-gpu hover:scale-[1.01] hover:bg-blue-600 active:bg-blue-700"
                type="submit"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
