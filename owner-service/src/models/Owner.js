import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['OWNER'],
        default: 'OWNER',
    },
    firstName: String,
    lastName: String,
    avatarUrl: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Method to compare passwords
ownerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to hash password
ownerSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export default mongoose.model('Owner', ownerSchema);
