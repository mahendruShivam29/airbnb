import mongoose from 'mongoose';
import { bookingConnectionPromise } from '../../../shared/booking-db-connection.js';

const bookingSchema = new mongoose.Schema({
    propertyId: {
        type: String,
        required: true,
    },
    travelerId: {
        type: String, // Changed from ObjectId to String for consistency
        required: true,
    },
    ownerId: String,
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice: Number,
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster queries
bookingSchema.index({ travelerId: 1, status: 1 });
bookingSchema.index({ ownerId: 1, status: 1 }); // Added index for owner queries
bookingSchema.index({ propertyId: 1, status: 1 });

// Use the shared booking connection
const bookingConnection = await bookingConnectionPromise;
export default bookingConnection.model('Booking', bookingSchema);
