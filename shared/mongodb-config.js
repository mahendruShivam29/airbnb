/**
 * Shared MongoDB Configuration
 * Single MongoDB instance with separate databases per service
 */
import mongoose from 'mongoose';

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017';

export const DB_NAMES = {
    TRAVELER: 'airbnb_traveler',
    OWNER: 'airbnb_owner',
    PROPERTY: 'airbnb_property',
    BOOKING: 'airbnb_booking',
    SESSIONS: 'airbnb_sessions',
};

/**
 * Connect to MongoDB with specific database
 * @param {Object} mongooseInstance - The mongoose instance from the service
 * @param {string} dbName - Database name from DB_NAMES
 */
export async function connectMongoDB(mongooseInstance, dbName) {
    try {
        // Handle URI construction properly with URL object to preserve query params
        const uriObj = new URL(MONGODB_URI);
        uriObj.pathname = dbName;

        const uri = uriObj.toString();

        console.log('🔌 Connecting to MongoDB with URI:', uri);
        await mongooseInstance.connect(uri);
        console.log(`✅ MongoDB connected: ${dbName}`);
        return mongooseInstance.connection;
    } catch (error) {
        console.error(`❌ MongoDB connection error (${dbName}):`, error);
        process.exit(1);
    }
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB() {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
}
