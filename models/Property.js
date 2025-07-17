// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  location: String,
  images: [String], // Cloudinary URLs
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);