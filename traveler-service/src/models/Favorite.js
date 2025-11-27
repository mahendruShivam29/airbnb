import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    propertyId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure unique favorites and faster queries
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
