/**
 * Redux Store Configuration
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        property: propertyReducer,
        booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types if needed
                ignoredActions: ['your/action/type'],
            },
        }),
});

// Note: For TypeScript projects, export these types:
// export type RootState = Ret [...]

export default store;

