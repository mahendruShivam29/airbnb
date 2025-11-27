/**
 * Authentication Slice - Redux Toolkit
 * Manages user authentication state with JWT tokens
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Load token from localStorage on app start
const loadTokenFromStorage = () => {
    try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return { token, user };
    } catch {
        return { token: null, user: null };
    }
};

const initialState = {
    user: loadTokenFromStorage().user,
    token: loadTokenFromStorage().token,
    isAuthenticated: !!loadTokenFromStorage().token,
    loading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password, role }, { rejectWithValue }) => {
        try {
            const endpoint = role === 'TRAVELER' ? '/traveler/auth/login' : '/owner/auth/login';
            const response = await api.post(endpoint, { email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async ({ email, password, firstName, lastName, role }, { rejectWithValue }) => {
        try {
            const endpoint = role === 'TRAVELER' ? '/traveler/auth/signup' : '/owner/auth/signup';
            const response = await api.post(endpoint, { email, password, firstName, lastName });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Signup failed');
        }
    }
);

export const loadCurrentUser = createAsyncThunk(
    'auth/loadCurrentUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (!auth.token) {
                throw new Error('No token');
            }

            const role = auth.user?.role;
            const endpoint = role === 'TRAVELER' ? '/traveler/auth/me' : '/owner/auth/me';
            const response = await api.get(endpoint);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to load user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('authToken', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                localStorage.setItem('authToken', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Load current user
        builder
            .addCase(loadCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(loadCurrentUser.rejected, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.user?.role;
