/**
 * Owner Service - Main Entry Point
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectMongoDB, DB_NAMES } from '../../shared/mongodb-config.js';
import { getBookingConnection } from '../../shared/booking-db-connection.js';
// import { startConsumer } from './kafka/consumer.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';

const app = express();
const PORT = process.env.PORT || 4003;

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
    res.json({ ok: true, service: 'owner-service' });
});

// Routes
app.use('/api/owner/auth', authRoutes);
app.use('/api/owner/bookings', bookingRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB for owner data
        await connectMongoDB(mongoose, DB_NAMES.OWNER);

        // Connect to shared bookings database
        await getBookingConnection();

        // Start Kafka consumer for booking requests
        // await startConsumer();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Owner Service running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
