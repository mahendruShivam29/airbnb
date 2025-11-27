import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    location: {
        type: String,
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    guests: Number,
    bedrooms: Number,
    bathrooms: Number,
    amenities: [String],
    images: [String],
    ownerId: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

propertySchema.index({ location: 1 });
propertySchema.index({ ownerId: 1 });
propertySchema.index({ pricePerNight: 1 });

export default mongoose.model('Property', propertySchema);
