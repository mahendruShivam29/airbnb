import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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
        enum: ['TRAVELER'],
        default: 'TRAVELER',
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
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export default mongoose.model('User', userSchema);
