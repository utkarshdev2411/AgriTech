import {createSlice} from '@reduxjs/toolkit'
import { loginAPI, signupAPI, getCurrentUserAPI } from '../services/userAction'

const initialState = {
    status: false,
    userInfo: {},
    loading: false,
    // success: null
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

            // // logoutAPI
            // .addCase(logoutAPI.pending, (state) => {
            //     state.loading = true
            //     state.success = null
            // })
            // .addCase(logoutAPI.fulfilled, (state, action) => {
            //     state.status = !action.payload.success
            //     state.userInfo = action.payload.data
            //     state.loading = false
            //     state.success = action.payload.success
            // })
            // .addCase(logoutAPI.rejected, (state, action) => {
            //     state.status = false
            //     state.loading = false
            //     state.success = false
            // })

            // // updateAvatarAPI
            // .addCase(updateAvatarAPI.pending, (state, action) => {
            //     state.loading = true
            //     state.success = null
            // })
            // .addCase(updateAvatarAPI.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.userInfo = action.payload.data
            //     state.success = action.payload.success
            // })
            // .addCase(updateAvatarAPI.rejected, (state, action) => {
            //     action.error.message = "Internal server error"
            //     state.message = action.error.message
            //     state.loading = false
            //     state.success = false
            // })
            
            // // removeAvatarAPI
            // .addCase(removeAvatarAPI.pending, (state, action) => {
            //     state.loading = true
            //     state.success = null
            // })
            // .addCase(removeAvatarAPI.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.userInfo = action.payload.data
            //     state.success = action.payload.success
            // })
            // .addCase(removeAvatarAPI.rejected, (state, action) => {
            //     action.error.message = "Internal server error"
            //     state.message = action.error.message
            //     state.loading = false
            //     state.success = false
            // })

            // // updateAccountAPI
            // .addCase(updateAccountAPI.pending, (state, action) => {
            //     state.loading = true
            //     state.message = null
            //     state.success = null
            // })
            // .addCase(updateAccountAPI.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.userInfo = action.payload.data.user
            //     state.message = action.payload.message
            //     state.success = action.payload.success
            // })
            // .addCase(updateAccountAPI.rejected, (state, action) => {
            //     state.loading = false
            //     action.error.message = "Internal server error"
            //     state.message = action.error.message
            //     state.success = false
            // })

            // // changePasswordAPI
            // .addCase(changePasswordAPI.pending, (state, action) => {
            //     state.loading = true
            //     state.message = null
            //     state.success = null
            // })
            // .addCase(changePasswordAPI.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.message = action.payload.message
            //     state.success = action.payload.success
            // })
            // .addCase(changePasswordAPI.rejected, (state, action) => {
            //     state.loading = false
            //     action.error.message = "Internal server Err"
            //     state.message = action.error.message
            //     state.success = false
            // })

            // getUserProfile

    }
})

// export const {resetUserState} = userSlice.actions

export default userSlice.reducer;