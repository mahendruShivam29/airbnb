/**
 * Shared Booking Database Connection
 * Used by both traveler and owner services to access the same booking collection
 */
import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAMES } from './mongodb-config.js';

// Create a singleton connection for the booking database
let bookingConnection = null;

export async function getBookingConnection() {
    if (!bookingConnection) {
        bookingConnection = mongoose.createConnection();
        const bookingUri = new URL(MONGODB_URI);
        bookingUri.pathname = DB_NAMES.BOOKING;
        await bookingConnection.openUri(bookingUri.toString());
        console.log(`✅ Shared Booking DB connected: ${DB_NAMES.BOOKING}`);
    }
    return bookingConnection;
}

// Export the connection promise for immediate use in models
export const bookingConnectionPromise = getBookingConnection();
