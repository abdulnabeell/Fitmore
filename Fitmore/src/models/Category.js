const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
   },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String, // URL or Base64
    required: false
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Hidden'],
    default: 'Published'
  },
  totalProducts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
