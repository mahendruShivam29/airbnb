/**
 * Traveler Service - Main Entry Point
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectMongoDB, DB_NAMES } from '../../shared/mongodb-config.js';
import { getBookingConnection } from '../../shared/booking-db-connection.js';
import { startConsumer } from './kafka/consumer.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import favoriteRoutes from './routes/favorites.js';

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Request logging
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'traveler-service' });
});

// Routes
app.use('/api/traveler/auth', authRoutes);
app.use('/api/traveler/bookings', bookingRoutes);
app.use('/api/traveler/favorites', favoriteRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB for traveler data
        await connectMongoDB(mongoose, DB_NAMES.TRAVELER);

        // Connect to shared bookings database
        await getBookingConnection();

        // Start Kafka consumer for booking responses
        await startConsumer();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Traveler Service running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
