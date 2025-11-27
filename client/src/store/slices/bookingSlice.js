/**
 * Booking Slice - Redux Toolkit
 * Manages traveler bookings, favorites, and booking status
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
    bookings: [],
    favorites: [],
    currentBooking: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
    'booking/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/traveler/bookings');
            return response.data.bookings;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch bookings');
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await api.post('/traveler/bookings', bookingData);
            return response.data.booking;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create booking');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'booking/cancelBooking',
    async (bookingId, { rejectWithValue }) => {
        try {
            const response = await api.put(`/traveler/bookings/${bookingId}/cancel`);
            return response.data.booking;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to cancel booking');
        }
    }
);

export const fetchFavorites = createAsyncThunk(
    'booking/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/traveler/favorites');
            return response.data.favorites;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch favorites');
        }
    }
);

export const addFavorite = createAsyncThunk(
    'booking/addFavorite',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/traveler/favorites/${propertyId}`);
            return response.data.favorite;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add favorite');
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'booking/removeFavorite',
    async (propertyId, { rejectWithValue }) => {
        try {
            await api.delete(`/traveler/favorites/${propertyId}`);
            return propertyId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to remove favorite');
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch bookings
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create booking
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.unshift(action.payload);
                state.currentBooking = action.payload;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Cancel booking
        builder
            .addCase(cancelBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            });

        // Fetch favorites
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favorites = action.payload;
            });

        // Add favorite
        builder
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favorites.push(action.payload);
            });

        // Remove favorite
        builder
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = state.favorites.filter(f => f.propertyId !== action.payload);
            });
    },
});

export const { clearError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;

// Selectors
export const selectBookings = (state) => state.booking.bookings;
export const selectFavorites = (state) => state.booking.favorites;
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectBookingLoading = (state) => state.booking.loading;
export const isFavorite = (state, propertyId) =>
    state.booking.favorites.some(f => f.propertyId === propertyId);
