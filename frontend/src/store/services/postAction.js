import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Update the getPosts action to support topic filtering
const getPosts = createAsyncThunk(
  "post/getPosts",
  async ({ page = 1, limit = 10, topic = null }, { rejectWithValue }) => {
    try {
      // Add topic to the query parameters if it exists and isn't "All Posts"
      let url = `${API_BASE_URL}/post?page=${page}&limit=${limit}`;
      if (topic && topic !== 'All Posts') {
        url += `&topic=${encodeURIComponent(topic)}`;
      }
      
      const response = await axios.get(url, { withCredentials: true });
      
      return {
        posts: response.data,
        page,
        hasMore: response.data.length === limit,
        topic
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getPostById = createAsyncThunk(
  "post/getPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/post/${postId}`,
        { withCredentials: true }
      );
      
      return { 
        postId,
        data: response.data.data
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update the createPost action to handle topics
const createPost = createAsyncThunk(
  "post/createpost",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("_id", data._id);
      
      // Add topics to formData
      if (data.topics && data.topics.length > 0) {
        data.topics.forEach(topic => {
          formData.append("topics[]", topic);
        });
      }
      
      // If image is provided, append to formData
      if (data.image) {
        formData.append("image", data.image);
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/post/create`,
        formData,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async (postId, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/${postId}/like`,
        {},
        { withCredentials: true }
      );
      
      // Return full response data including the updated post
      return { 
        ...response.data, 
        postId 
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/${postId}/comments`,
        { content },
        { withCredentials: true }
      );
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getComments = createAsyncThunk(
  "post/getComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/post/${postId}/comments`,
        { withCredentials: true }
      );
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/post/${postId}`,
        { withCredentials: true }
      );
      return { ...response.data, postId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add this new action
const incrementPostView = createAsyncThunk(
  "post/incrementView",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/${postId}/view`,
        {},
        { withCredentials: true }
      );
      
      return { 
        postId,
        data: response.data.data
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Export it along with other actions
export {
  getPosts,
  getPostById,
  createPost,
  toggleLike,
  addComment,
  getComments,
  deletePost,
  incrementPostView
};
