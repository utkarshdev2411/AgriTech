import {createSlice} from '@reduxjs/toolkit'
import { getPosts, createPost } from '../services/postAction'

const initialState = {
    status: false,
    posts:{},
    loading: false,
}

const postSlice = createSlice({
    name: "posts",
    initialState,
    extraReducers: (builder) => {
        builder
            //signupAPI
            .addCase(getPosts.pending, (state, action) => {
                state.loading = true
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.status = action.payload.success
                state.posts = action.payload
                state.loading = false
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.status = false
                state.loading = false
            })

            // loginAPI
            .addCase(createPost.pending, (state) => {
                state.loading = true
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = action.payload.success
                state.posts = action.payload
                state.loading = false
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = false
                state.loading = false
            })
    }
})


export default postSlice.reducer;