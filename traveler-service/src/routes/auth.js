/**
 * Authentication Routes for Traveler Service
 */
import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import { generateToken, authenticateJWT } from '../../../shared/jwt-utils.js';

const router = express.Router();

/**
 * POST /api/traveler/auth/signup
 * Register a new traveler
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
            console.log('📝 Signup request received:', req.body.email);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('❌ Validation errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, firstName, lastName } = req.body;

            // Check if user already exists
            console.log('🔍 Checking for existing user...');
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('⚠️ User already exists');
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            console.log('🔐 Hashing password...');
            const passwordHash = await User.hashPassword(password);

            // Create new user
            console.log('👤 Creating user object...');
            const user = new User({
                email,
                passwordHash,
                firstName,
                lastName,
                role: 'TRAVELER',
            });

            console.log('💾 Saving user to MongoDB...');
            await user.save();
            console.log('✅ User saved!');

            // Generate JWT token
            console.log('🔑 Generating token...');
            const token = generateToken({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            res.status(201).json({
                message: 'Traveler registered successfully',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error('❌ Signup error details:', error);
            res.status(500).json({ error: 'Registration failed: ' + error.message });
        }
    }
);

/**
 * POST /api/traveler/auth/login
 * Login for travelers
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

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = generateToken({
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatarUrl: user.avatarUrl,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

/**
 * GET /api/traveler/auth/me
 * Get current user info
 */
router.get('/me', authenticateJWT, async (req, res) => {
    try {
        // Token verification happens in middleware
        const user = await User.findById(req.user.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

/**
 * PUT /api/traveler/auth/me
 * Update current user info
 */
router.put('/me', authenticateJWT, async (req, res) => {
    try {
        const updates = req.body;
        // Prevent updating sensitive fields
        delete updates.passwordHash;
        delete updates.email;
        delete updates.role;
        delete updates._id;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * POST /api/traveler/auth/avatar
 * Upload avatar for current user
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
        const user = await User.findById(req.user.id);
        if (user.avatarUrl) {
            const oldPath = path.join(process.cwd(), user.avatarUrl.replace(/^\//, ''));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update user with new avatar URL
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { avatarUrl } },
            { new: true }
        ).select('-passwordHash');

        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl,
            user: updatedUser
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

export default router;
