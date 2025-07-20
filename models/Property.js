import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  location: String,
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  propertyType: { type: String, enum: ['apartment', 'villa', 'office', 'land'], default: 'apartment' },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  area: { type: String },
  pinLocation: {
    lat: { type: Number, default: function() { return this.latitude } },
    lng: { type: Number, default: function() { return this.longitude } }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'pending', 'sold', 'archived'],
    default: 'draft'
  }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);