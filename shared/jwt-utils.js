/**
 * Shared JWT Utilities
 * For token generation and verification across services
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode
 * @returns {string} - JWT token
 */
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Middleware to check user role
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
}
