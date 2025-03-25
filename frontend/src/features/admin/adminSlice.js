import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Admin login
export const adminLogin = createAsyncThunk('admin/login', async (credentials, thunkAPI) => {
    try {
        return await adminService.login(credentials);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Admin logout
export const adminLogout = createAsyncThunk('admin/logout', async () => {
    adminService.logout();
});

// Get all users
export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().admin.admin.token;
        return await adminService.getUsers(token);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().admin.admin.token;
        return await adminService.deleteUser(userId, token);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Create user
export const createUser = createAsyncThunk(
    'admin/createUser',
    async (userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().admin.admin.token;
            return await adminService.createUser(userData, token);
        } catch (error) {
            const message = 
                (error.response && 
                    error.response.data && 
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update user
export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ userId, userData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().admin.admin.token;
            return await adminService.updateUser(userId, userData, token);
        } catch (error) {
            const message = 
                (error.response && 
                    error.response.data && 
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetAdmin: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.admin = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.admin = null;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.admin = null;
            })
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.filter(user => user._id !== action.meta.arg);
            })
            // Add the new cases inside the builder function
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = state.users.map(user => 
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;