import 'dotenv/config'; // Load env vars
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectMongoDB, DB_NAMES } from '../../shared/mongodb-config.js';
import propertyRoutes from './routes/properties.js';

const app = express();
const PORT = process.env.PORT || 4002;

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
    res.json({ ok: true, service: 'property-service' });
});

// Routes
app.use('/api/properties', propertyRoutes);

// Error handling
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB using shared config
        await connectMongoDB(mongoose, DB_NAMES.PROPERTY);

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Property Service running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
