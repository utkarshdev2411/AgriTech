import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const signupAPI = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const loginAPI = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getCurrentUserAPI = createAsyncThunk(
  "auth/getcurrentuser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/current-user",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const logoutAPI = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateAvatarAPI = createAsyncThunk(
  "profile/updateAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      const response = await axios.patch('http://localhost:8000/api/v1/users/update-avatar', formData, {withCredentials: true})
      return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const removeAvatarAPI = createAsyncThunk(
  "profile/removeAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete('http://localhost:8000/api/v1/users/delete-avatar', {withCredentials: true})
      return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const updateAccountAPI = createAsyncThunk(
  "profile/updateAccount",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data)
      const response = await axios.post('http://localhost:8000/api/v1/users/update-user-details', {fullname: data.fullname, username: data.username, bio: data.bio, addLinks: data.links}, {withCredentials: true})
      console.log(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const changePasswordAPI = createAsyncThunk(
  "profile/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data)
      const response = axios.post('http://localhost:8000/api/v1/users/change-password', data, {withCredentials: true})
      return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export {
  signupAPI,
  loginAPI,
  logoutAPI,
  getCurrentUserAPI,
  updateAvatarAPI,
  removeAvatarAPI,
  updateAccountAPI,
  changePasswordAPI,
};
