import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'golden','diamond'], 
      default: 'free' 
    },
    listingsUsed: { 
      type: Number, 
      default: 0 
    },
    featuredListings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: [] // Add default here
    }]
  },
  likedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: [] // Ensure default empty array
  }],
  image: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true,
  // Add this to ensure defaults are applied to existing documents
  minimize: false 
});

export default mongoose.models.User || mongoose.model('User', userSchema);