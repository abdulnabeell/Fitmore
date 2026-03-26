const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    validUntil: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
