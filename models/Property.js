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
  propertyType: { type: String, enum: ['apartment', 'villa', 'office', 'land','full_floor' , 'full_building' , 'shop','house','arabian_house','farm','warehouse' , 'seaside_chalet', 'palace','showroom' , 'wedding_hall'], default: 'apartment' },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  area: { type: String },
  pinLocation: {
    lat: { type: Number, default: function() { return this.latitude } },
    lng: { type: Number, default: function() { return this.longitude } }
  },
    contractType: { 
    type: String, 
    enum: ['rent', 'sale', 'mortgage'], 
    required: true,
    default: 'sale'
  },
  ownershipType: {
    type: String,
    enum: [
      'green_deed', 
      'white_deed', 
      'court_decision', 
      'notary', 
      'emiri', 
      'reform', 
      'charitable_endowment', 
      'lineage_endowment'
    ],
    required: true
  },
    governorate: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'pending', 'sold', 'archived'],
    default: 'draft'
  }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);