/**
 * Authentication Routes for Owner Service
 */
import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Owner from '../models/Owner.js';
import { generateToken, authenticateJWT } from '../../../shared/jwt-utils.js';

const router = express.Router();

/**
 * POST /api/owner/auth/signup
 * Register a new owner
 */
router.post(
    '/signup',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('firstName').notEmpty().trim(),
        body('lastName').notEmpty().trim(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, firstName, lastName } = req.body;

            // Check if owner already exists
            const existingOwner = await Owner.findOne({ email });
            if (existingOwner) {
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            const passwordHash = await Owner.hashPassword(password);

            // Create new owner
            const owner = new Owner({
                email,
                passwordHash,
                firstName,
                lastName,
                role: 'OWNER',
            });

            await owner.save();

            // Generate JWT token
            const token = generateToken({
                id: owner._id.toString(),
                email: owner.email,
                role: owner.role,
            });

            res.status(201).json({
                message: 'Owner registered successfully',
                token,
                user: {
                    id: owner._id,
                    email: owner.email,
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    role: owner.role,
                },
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

/**
 * POST /api/owner/auth/login
 * Login for owners
 */
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find owner
            const owner = await Owner.findOne({ email });
            if (!owner) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isMatch = await owner.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = generateToken({
                id: owner._id.toString(),
                email: owner.email,
                role: owner.role,
            });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: owner._id,
                    email: owner.email,
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    role: owner.role,
                    avatarUrl: owner.avatarUrl,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

/**
 * GET /api/owner/auth/me
 * Get current owner info
 */
router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const owner = await Owner.findById(req.user.id).select('-passwordHash');

        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }

        res.json({ user: owner });
    } catch (error) {
        console.error('Get owner error:', error);
        res.status(500).json({ error: 'Failed to fetch owner' });
    }
});

/**
 * PUT /api/owner/auth/me
 * Update current owner info
 */
router.put('/me', authenticateJWT, async (req, res) => {
    try {
        const updates = req.body;
        // Prevent updating sensitive fields
        delete updates.passwordHash;
        delete updates.email;
        delete updates.role;
        delete updates._id;

        const owner = await Owner.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }

        res.json({ user: owner });
    } catch (error) {
        console.error('Update owner error:', error);
        res.status(500).json({ error: 'Failed to update owner' });
    }
});

/**
 * POST /api/owner/auth/avatar
 * Upload avatar for current owner
 */
// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/avatars';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.post('/avatar', authenticateJWT, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Delete old avatar if exists
        const owner = await Owner.findById(req.user.id);
        if (owner.avatarUrl) {
            const oldPath = path.join(process.cwd(), owner.avatarUrl.replace(/^\//, ''));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update owner with new avatar URL
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const updatedOwner = await Owner.findByIdAndUpdate(
            req.user.id,
            { $set: { avatarUrl } },
            { new: true }
        ).select('-passwordHash');

        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl,
            user: updatedOwner
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

export default router;
