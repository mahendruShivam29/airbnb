/**
 * Booking Routes for Owner Service
 */
import express from 'express';
import axios from 'axios';
import Booking from '../models/Booking.js';
import { authenticateJWT, requireRole } from '../../../shared/jwt-utils.js';
// import { publishBookingResponse } from '../kafka/producer.js';

const router = express.Router();

// All routes require authentication and owner role
router.use(authenticateJWT);
router.use(requireRole(['OWNER']));

const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:4002';

/**
 * GET /api/owner/bookings
 * Get all booking requests for the owner with property details
 */
router.get('/', async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { status } = req.query;

        const filter = { ownerId };
        if (status) {
            filter.status = status;
        }

        const bookings = await Booking.find(filter).sort({ createdAt: -1 });

        // Fetch property details for each booking
        const bookingsWithProperties = await Promise.all(
            bookings.map(async (booking) => {
                try {
                    const response = await axios.get(`${PROPERTY_SERVICE_URL}/api/properties/${booking.propertyId}`);
                    return {
                        ...booking.toObject(),
                        property: response.data.property,
                        id: booking._id.toString(),
                        startDate: booking.checkInDate,
                        endDate: booking.checkOutDate
                    };
                } catch (error) {
                    console.error(`Failed to fetch property ${booking.propertyId}:`, error.message);
                    return {
                        ...booking.toObject(),
                        property: { name: 'Property not found', pricePerNight: 0 },
                        id: booking._id.toString(),
                        startDate: booking.checkInDate,
                        endDate: booking.checkOutDate
                    };
                }
            })
        );

        res.json({ bookings: bookingsWithProperties });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

/**
 * GET /api/owner/bookings/:id
 * Get a specific booking
 */
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            ownerId: req.user.id,
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ booking });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

/**
 * PUT /api/owner/bookings/:id/status
 * Update booking status (accept or cancel/decline)
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { action } = req.body;

        if (!['ACCEPT', 'CANCEL'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action' });
        }

        const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'CANCELLED';

        const booking = await Booking.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerId: req.user.id,
                status: 'PENDING',
            },
            {
                status: newStatus,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or already processed' });
        }

        // Publish response to Kafka
        // await publishBookingResponse({
        //     bookingId: booking._id.toString(),
        //     status: newStatus,
        //     ownerId: req.user.id,
        // });

        res.json({
            message: `Booking ${action.toLowerCase()}ed successfully`,
            booking,
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

export default router;
