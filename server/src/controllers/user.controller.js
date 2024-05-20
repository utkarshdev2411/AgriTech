import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

// Register
const userRegister = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if ([fullname, username, password].some((field) => field?.trim === "")) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(StatusCodes.BAD_REQUEST, {}, "All fields required")
      );
  }

  // const existedUserByUsername = await User.findOne({ username });

  // if (existedUserByUsername) {
  //   return res
  //     .status(StatusCodes.CONFLICT)
  //     .json(
  //       new ApiResponse(StatusCodes.CONFLICT, {}, "Username already existed")
  //     );
  // }

  const existedUserByEmail = await User.findOne({ email });

  if (existedUserByEmail) {
    return res
      .status(StatusCodes.CONFLICT)
      .json(new ApiResponse(StatusCodes.CONFLICT, {}, "Email already existed"));
  }

  
  const newUser = await User.create({
    fullname,
    username,
    email,
    password,
    avatar: process.env.DEFAULT_AVATAR,
  });

  await newUser.save();

  const token = await newUser.generateAccessToken();
  // console.log({ token, newUser })

  const createdUser = await User.findById(newUser._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  if (!createdUser) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong while registering the user"
    );
  }

  return (
    res
    .status(StatusCodes.CREATED)
    .cookie("token", token,options)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        createdUser,
        "User registered successfully"
      )
    ));
});

// Login
const userLogin = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if ([identifier, password].some((field) => field?.trim === "")) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(StatusCodes.BAD_REQUEST, {}, "All fields required")
      );
  }

  const existedUser = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

  if (!existedUser) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiResponse(StatusCodes.UNAUTHORIZED, {}, "Invalid Credentials")
      );
  }

  const isValidPassword = await existedUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiResponse(StatusCodes.UNAUTHORIZED, {}, "Invalid Credentials")
      );
  }

  const token = await existedUser.generateAccessToken();

  const loggedInUser = await User.findById(existedUser._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(StatusCodes.OK)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        loggedInUser,
        "User logged in successfully"
      )
    );
});

// Current User
const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        req.user,
        "Current user fetched successfully"
      )
    );
});

// Logout
const userLogout = asyncHandler(async (_, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(StatusCodes.OK)
    .cookie("token", "", options)
    .json(new ApiResponse(StatusCodes.OK, {}, "User logged out"));
});

// Update User Account Details
const updateUserAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, username, bio, addLinks } = req.body;

  if (!fullname || !username) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Fullname and username required"
    );
  }

  const existedUser = await User.findOne({ username });

  if (!bio && existedUser.bio) {
    existedUser.bio = undefined;
    await existedUser.save();
  }

  if (existedUser && req.user.username !== username) {
    return res
      .status(StatusCodes.CONFLICT)
      .json(
        new ApiResponse(
          StatusCodes.CONFLICT,
          req.user,
          "Username already existed"
        )
      );
  }

  const updateUser = {
    fullname,
    username,
    bio,
  };

  if (addLinks) {
    updateUser.links = addLinks;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,

    {
      $set: updateUser,
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, user, "User updated successfully!")
    );
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(StatusCodes.BAD_REQUEST, {}, "All fields required")
      );
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        new ApiResponse(StatusCodes.NOT_FOUND, {}, "Incorrect old password")
      );
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, {}, "Password Changed Successfully"));
});

// UpdateUserAvatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Avatar file is missing");
  }

  const oldAvatarURL = req.user?.avatar;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.secure_url) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while uploading on cloudinary"
    );
  }


  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.secure_url,
      },
    },
    { new: true }
  ).select("-password");

  await user.save()

  if (oldAvatarURL !== process.env.DEFAULT_AVATAR) {
    const avatarPublicId = oldAvatarURL
      .split("/v")[1]
      .split("/")[1]
      .split(".")[0];
    await deleteFromCloudinary(avatarPublicId);
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, user, "Avatar image changed successfully")
    );
});

// RemoveUserAvatar
const removeUserAvatar = asyncHandler(async (req, res) => {
  const oldAvatarURL = req.user?.avatar;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: process.env.DEFAULT_AVATAR,
      },
    },
    { new: true }
  ).select("-password");

  if (oldAvatarURL !== process.env.DEFAULT_AVATAR) {
    const avatarPublicId = oldAvatarURL
      .split("/v")[1]
      .split("/")[1]
      .split(".")[0];
    await deleteFromCloudinary(avatarPublicId);
  }

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, "Avatar removed successfully"));
});

export {
  userRegister,
  userLogin,
  currentUser,
  userLogout,
  updateUserAccountDetails,
  changePassword,
  updateUserAvatar,
  removeUserAvatar,
};
