import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { updateProfile } from '../user/userSlice';

// Initial state
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Async thunks for user signup, login, and logout
export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
    try {
        return await authService.signup(userData);
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message; // Get detailed message
        console.log(errorMsg); // Log it
        return thunkAPI.rejectWithValue(errorMsg); // Send to Redux
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message; // Get detailed message
        console.log(errorMsg); // Log it
        return thunkAPI.rejectWithValue(errorMsg); // Send to Redux
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        await authService.logout(config);
        localStorage.removeItem('user');
        return null;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        // Add this reducer to handle user updates
        userUpdated: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { reset, userUpdated } = authSlice.actions;
export default authSlice.reducer;
