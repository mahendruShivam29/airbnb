import mongoose from 'mongoose';
import { bookingConnectionPromise } from '../../../shared/booking-db-connection.js';

const bookingSchema = new mongoose.Schema({
    propertyId: {
        type: String,
        required: true,
    },
    travelerId: String,
    ownerId: {
        type: String, // Changed from ObjectId to String for consistency
        required: true,
    },
    checkInDate: Date,
    checkOutDate: Date,
    guests: Number,
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
bookingSchema.index({ ownerId: 1, status: 1 });
bookingSchema.index({ travelerId: 1, status: 1 });
bookingSchema.index({ propertyId: 1, status: 1 });

// Use the shared booking connection and same model name as traveler service
const bookingConnection = await bookingConnectionPromise;
export default bookingConnection.model('Booking', bookingSchema);
