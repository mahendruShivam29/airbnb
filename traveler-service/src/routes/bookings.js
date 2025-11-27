/**
 * Booking Routes for Traveler Service
 */
import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import { authenticateJWT } from '../../../shared/jwt-utils.js';
import { publishBookingRequest } from '../kafka/producer.js';
import axios from 'axios';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:4002';

/**
 * POST /api/traveler/bookings
 * Create a new booking request
 */
router.post(
    '/',
    [
        body('propertyId').notEmpty(),
        body('checkInDate').isISO8601(),
        body('checkOutDate').isISO8601(),
        body('guests').isInt({ min: 1 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { propertyId, checkInDate, checkOutDate, guests } = req.body;
            const travelerId = req.user.id;

            // Fetch property details to get ownerId and price
            let propertyData;
            try {
                const response = await axios.get(`${PROPERTY_SERVICE_URL}/api/properties/${propertyId}`);
                propertyData = response.data.property; // Extract property from response
            } catch (error) {
                console.error('Property fetch error:', error);
                return res.status(404).json({ error: 'Property not found' });
            }

            // Calculate total price (simplified)
            const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = nights * propertyData.pricePerNight;

            // Create booking in database
            const booking = new Booking({
                propertyId,
                travelerId,
                ownerId: propertyData.ownerId,
                checkInDate,
                checkOutDate,
                guests,
                totalPrice,
                status: 'PENDING',
            });

            await booking.save();

            // Publish booking request to Kafka
            await publishBookingRequest(booking);

            res.status(201).json({
                message: 'Booking request created and sent to property owner',
                booking,
            });
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ error: 'Failed to create booking' });
        }
    }
);

/**
 * GET /api/traveler/bookings
 * Get all bookings for the logged-in traveler
 */
router.get('/', async (req, res) => {
    try {
        const travelerId = req.user.id;
        const bookings = await Booking.find({ travelerId }).sort({ createdAt: -1 });

        // Transform bookings to match frontend expectations
        const transformedBookings = bookings.map(booking => ({
            ...booking.toObject(),
            id: booking._id.toString(),
            startDate: booking.checkInDate,
            endDate: booking.checkOutDate
        }));

        res.json({ bookings: transformedBookings });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

/**
 * GET /api/traveler/bookings/:id
 * Get a specific booking
 */
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            travelerId: req.user.id,
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
 * PUT /api/traveler/bookings/:id/cancel
 * Cancel a booking
 */
router.put('/:id/cancel', async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            {
                _id: req.params.id,
                travelerId: req.user.id,
                status: { $in: ['PENDING', 'ACCEPTED'] },
            },
            {
                status: 'CANCELLED',
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
        }

        res.json({
            message: 'Booking cancelled successfully',
            booking,
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

export default router;
