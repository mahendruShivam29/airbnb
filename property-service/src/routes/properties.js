import express from 'express';
import Property from '../models/Property.js';
import { authenticateJWT } from '../../../shared/jwt-utils.js';

const router = express.Router();

// Helper function to transform property data for frontend
const transformProperty = (property) => {
    if (!property) return null;

    const obj = property.toObject ? property.toObject() : property;

    // Parse location string into components
    const locationParts = (obj.location || '').split(',').map(s => s.trim());
    const [address = '', city = '', state = '', country = ''] = locationParts;

    return {
        id: obj._id.toString(),
        name: obj.title,
        description: obj.description,
        address,
        city,
        state,
        country,
        location: obj.location,
        pricePerNight: obj.pricePerNight,
        bedrooms: obj.bedrooms,
        bathrooms: obj.bathrooms,
        maxGuests: obj.guests,
        amenities: obj.amenities,
        photos: obj.images,
        ownerId: obj.ownerId,
        available: obj.available,
        createdAt: obj.createdAt
    };
};


// GET /api/properties - Search properties
router.get('/', async (req, res) => {
    try {
        const { location, guests, minPrice, maxPrice } = req.query;

        const filter = {};
        if (location) {
            filter.location = new RegExp(location, 'i');
        }
        if (guests) {
            filter.guests = { $gte: parseInt(guests) };
        }
        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = parseInt(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = parseInt(maxPrice);
        }

        const properties = await Property.find(filter).sort({ createdAt: -1 });
        const transformedProperties = properties.map(transformProperty);
        res.json({ properties: transformedProperties });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search properties' });
    }
});

// GET /api/properties/mine - Get my properties
router.get('/mine', authenticateJWT, async (req, res) => {
    try {
        console.log('=== Fetching owner properties ===');
        console.log('User from token:', JSON.stringify(req.user, null, 2));
        console.log('Owner ID from token:', req.user.id);
        console.log('Type of owner ID:', typeof req.user.id);

        const properties = await Property.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
        console.log(`Found ${properties.length} properties for owner ${req.user.id}`);

        // Also check if there are ANY properties in the database
        const allProperties = await Property.find({});
        console.log(`Total properties in database: ${allProperties.length}`);

        if (allProperties.length > 0) {
            console.log('All property ownerIds in database:');
            allProperties.forEach((p, idx) => {
                console.log(`  [${idx}] ID: ${p._id}, ownerId: "${p.ownerId}", title: ${p.title}`);
                console.log(`       Type: ${typeof p.ownerId}, Match: ${p.ownerId === req.user.id ? 'YES' : 'NO'}`);
            });
        }

        const transformedProperties = properties.map(transformProperty);
        res.json({ properties: transformedProperties });
    } catch (error) {
        console.error('Get my properties error:', error);
        res.status(500).json({ error: 'Failed to fetch your properties' });
    }
});

// TEMPORARY: Debug endpoint to diagnose owner ID mismatch
router.get('/debug/owner-check', authenticateJWT, async (req, res) => {
    try {
        const allProperties = await Property.find({});
        const myProperties = await Property.find({ ownerId: req.user.id });

        res.json({
            tokenUser: req.user,
            tokenOwnerId: req.user.id,
            tokenOwnerIdType: typeof req.user.id,
            myPropertiesCount: myProperties.length,
            allPropertiesCount: allProperties.length,
            allOwnerIds: allProperties.map(p => ({
                propertyId: p._id.toString(),
                title: p.title,
                ownerId: p.ownerId,
                ownerIdType: typeof p.ownerId,
                matches: p.ownerId === req.user.id
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// TEMPORARY: Fix endpoint to update properties with undefined ownerIds
router.post('/debug/fix-owner-ids', authenticateJWT, async (req, res) => {
    try {
        const result = await Property.updateMany(
            { ownerId: 'undefined' },
            { $set: { ownerId: req.user.id } }
        );

        res.json({
            message: 'Fixed properties with undefined owner IDs',
            modifiedCount: result.modifiedCount,
            actuallyMatched: result.matchedCount,
            newOwnerId: req.user.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/properties/:id - Get property details
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const transformedProperty = transformProperty(property);
        res.json({ property: transformedProperty });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// POST /api/properties - Create property
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const {
            name,
            description,
            address,
            city,
            state,
            country,
            pricePerNight,
            maxGuests,
            bedrooms,
            bathrooms,
            amenities,
            availableFrom,
            availableTo
        } = req.body;

        // Construct location string
        const location = [address, city, state, country].filter(Boolean).join(', ');

        console.log('Creating property with data:', {
            title: name,
            location,
            pricePerNight,
            ownerId: req.user.id
        });

        const property = new Property({
            title: name,
            description,
            location,
            pricePerNight,
            guests: maxGuests,
            bedrooms,
            bathrooms,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
            ownerId: req.user.id,
            available: true // Default to available
        });

        await property.save();

        const transformedProperty = transformProperty(property);
        res.status(201).json({
            message: 'Property created successfully',
            property: transformedProperty,
        });
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ error: error.message || 'Failed to create property' });
    }
});

// PUT /api/properties/:id - Update property
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const property = await Property.findOne({ _id: req.params.id, ownerId: req.user.id });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or unauthorized' });
        }

        const {
            name,
            description,
            address,
            city,
            state,
            country,
            pricePerNight,
            maxGuests,
            bedrooms,
            bathrooms,
            amenities,
            availableFrom,
            availableTo
        } = req.body;

        // Construct location string
        const location = [address, city, state, country].filter(Boolean).join(', ');

        // Update property fields
        property.title = name;
        property.description = description;
        property.location = location;
        property.pricePerNight = pricePerNight;
        property.guests = maxGuests;
        property.bedrooms = bedrooms;
        property.bathrooms = bathrooms;
        property.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

        await property.save();

        const transformedProperty = transformProperty(property);
        res.json({
            message: 'Property updated successfully',
            property: transformedProperty,
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ error: error.message || 'Failed to update property' });
    }
});

// Configure Multer for file uploads
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// POST /api/properties/:id/photos - Upload photos
router.post('/:id/photos', authenticateJWT, upload.array('photos', 10), async (req, res) => {
    try {
        const property = await Property.findOne({ _id: req.params.id, ownerId: req.user.id });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or unauthorized' });
        }

        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        property.images.push(...imagePaths);
        await property.save();

        res.json({
            message: 'Photos uploaded successfully',
            images: property.images
        });
    } catch (error) {
        console.error('Upload photos error:', error);
        res.status(500).json({ error: 'Failed to upload photos' });
    }
});

export default router;
