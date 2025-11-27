/**
 * Property Slice - Redux Toolkit
 * Manages property listings, search results, and current property details
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
    properties: [],
    searchResults: [],
    currentProperty: null,
    loading: false,
    error: null,
    searchFilters: {
        location: '',
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
    },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
    'property/fetchProperties',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.location) params.append('location', filters.location);
            if (filters.checkInDate) params.append('checkInDate', filters.checkInDate);
            if (filters.checkOutDate) params.append('checkOutDate', filters.checkOutDate);
            if (filters.guests) params.append('guests', filters.guests);

            const response = await api.get(`/properties?${params.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch properties');
        }
    }
);

export const fetchPropertyById = createAsyncThunk(
    'property/fetchPropertyById',
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/properties/${propertyId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch property');
        }
    }
);

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        setSearchFilters: (state, action) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        clearCurrentProperty: (state) => {
            state.currentProperty = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch properties
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.properties || action.payload;
                state.properties = action.payload.properties || action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch property by ID
        builder
            .addCase(fetchPropertyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProperty = action.payload.property || action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSearchFilters, clearCurrentProperty, clearError } = propertySlice.actions;
export default propertySlice.reducer;

// Selectors
export const selectProperties = (state) => state.property.properties;
export const selectSearchResults = (state) => state.property.searchResults;
export const selectCurrentProperty = (state) => state.property.currentProperty;
export const selectPropertyLoading = (state) => state.property.loading;
export const selectSearchFilters = (state) => state.property.searchFilters;
