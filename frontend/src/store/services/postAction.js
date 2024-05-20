import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getPosts = createAsyncThunk(
  "post/getposts",
  async (_, { rejectWithValue }) => {
    try {
        const user = await axios.get('http://localhost:8000/post', {
            withCredentials: true
          })
      return user.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createPost = createAsyncThunk(
  "post/createpost",
  async (data, { rejectWithValue }) => {
    try {
        console.log(data)
      const post=  await axios.post('http://localhost:8000/post/create',
        {
          content: data.content,
          _id: data._id
        })
        
      return post.data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export {
    getPosts,
    createPost
};
