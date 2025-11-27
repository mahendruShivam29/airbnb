/**
 * Favorites Routes for Traveler Service
 */
import express from 'express';
import axios from 'axios';
import Favorite from '../models/Favorite.js';
import { authenticateJWT } from '../../../shared/jwt-utils.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

/**
 * POST /api/traveler/favorites/:propertyId
 * Add a property to favorites
 */
router.post('/:propertyId', async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        // Check if already favorited
        const existing = await Favorite.findOne({ userId, propertyId });
        if (existing) {
            return res.status(409).json({ error: 'Property already in favorites' });
        }

        const favorite = new Favorite({ userId, propertyId });
        await favorite.save();

        res.status(201).json({
            message: 'Property added to favorites',
            favorite,
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

/**
 * DELETE /api/traveler/favorites/:propertyId
 * Remove a property from favorites
 */
router.delete('/:propertyId', async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        const result = await Favorite.findOneAndDelete({ userId, propertyId });

        if (!result) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json({ message: 'Property removed from favorites' });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

/**
 * GET /api/traveler/favorites
 * Get all favorites for the logged-in traveler with property details
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

        // Fetch property details for each favorite
        const propertiesWithDetails = await Promise.all(
            favorites.map(async (fav) => {
                try {
                    const propertyServiceUrl = process.env.PROPERTY_SERVICE_URL || 'http://localhost:4002';
                    const response = await axios.get(
                        `${propertyServiceUrl}/api/properties/${fav.propertyId}`
                    );
                    return response.data.property;
                } catch (error) {
                    console.error(`Failed to fetch property ${fav.propertyId}:`, error.message);
                    return null;
                }
            })
        );

        // Filter out any null values (failed fetches)
        const validProperties = propertiesWithDetails.filter(p => p !== null);

        res.json(validProperties);
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

export default router;
