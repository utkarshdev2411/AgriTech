import {createSlice} from '@reduxjs/toolkit'
import { loginAPI, logoutAPI, signupAPI, getCurrentUserAPI, updateAvatarAPI, removeAvatarAPI, updateAccountAPI, changePasswordAPI } from '../services/userAction'

const initialState = {
    status: false,
    userInfo: {},
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
            //signupAPI
            .addCase(signupAPI.pending, (state, action) => {
                state.loading = true
            })
            .addCase(signupAPI.fulfilled, (state, action) => {
                state.status = action.payload.success
                state.userInfo = action.payload.data
                state.loading = false
            })
            .addCase(signupAPI.rejected, (state, action) => {
                state.status = false
                state.loading = false
            })

            // loginAPI
            .addCase(loginAPI.pending, (state) => {
                state.loading = true
            })
            .addCase(loginAPI.fulfilled, (state, action) => {
                state.status = action.payload.success
                state.userInfo = action.payload.data
                state.loading = false
            })
            .addCase(loginAPI.rejected, (state, action) => {
                state.status = false
                state.loading = false
            })

            // getCurrentUserAPI
            .addCase(getCurrentUserAPI.pending, (state) => {
                state.loading = true
            })
            .addCase(getCurrentUserAPI.fulfilled, (state, action) => {
                state.status = action.payload.success
                state.userInfo = action.payload.data,
                state.loading = false
            })
            .addCase(getCurrentUserAPI.rejected, (state) => {
                state.status = false
                state.loading = false
            })

            // logoutAPI
            .addCase(logoutAPI.pending, (state) => {
                state.loading = true
            })
            .addCase(logoutAPI.fulfilled, (state, action) => {
                state.status = !action.payload.success
                state.userInfo = action.payload.data
                state.loading = false
            })
            .addCase(logoutAPI.rejected, (state, action) => {
                state.status = false
                state.loading = false
            })

            // updateAvatarAPI
            .addCase(updateAvatarAPI.pending, (state, action) => {
                state.loading = true
            })
            .addCase(updateAvatarAPI.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload.data
            })
            .addCase(updateAvatarAPI.rejected, (state, action) => {
                state.loading = false
            })
            
            // removeAvatarAPI
            .addCase(removeAvatarAPI.pending, (state, action) => {
                state.loading = true
            })
            .addCase(removeAvatarAPI.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload.data
            })
            .addCase(removeAvatarAPI.rejected, (state, action) => {
                state.loading = false
            })

            // updateAccountAPI
            .addCase(updateAccountAPI.pending, (state, action) => {
                state.loading = true
            })
            .addCase(updateAccountAPI.fulfilled, (state, action) => {
                state.loading = false
                state.userInfo = action.payload.data
            })
            .addCase(updateAccountAPI.rejected, (state, action) => {
                state.loading = false
            })

            // changePasswordAPI
            .addCase(changePasswordAPI.pending, (state, action) => {
                state.loading = true
            })
            .addCase(changePasswordAPI.fulfilled, (state, action) => {
                state.loading = false
                state.message = action.payload.message
                state.success = action.payload.success
            })
            .addCase(changePasswordAPI.rejected, (state, action) => {
                state.loading = false
            })

    }
})

// export const {resetUserState} = userSlice.actions

export default userSlice.reducer;