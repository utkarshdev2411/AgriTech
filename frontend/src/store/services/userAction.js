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
      return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getCurrentUserAPI = createAsyncThunk(
  "auth/getcurrentuser",
  async (_, { rejectWithValue }) => {
    try {
        const response = await axios
        .get("http://localhost:8000/api/v1/users/current-user", {
          withCredentials: true,
        })
        return response.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export {
  signupAPI,
  loginAPI,
  getCurrentUserAPI,
};
