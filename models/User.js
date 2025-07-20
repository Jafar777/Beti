import mongoose from 'mongoose';

// Define the schema first
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
      default: 'free' 
    },
    listingsUsed: { 
      type: Number, 
      default: 0 
    }
  },
  image: { 
    type: String, 
    default: '' 
  },
    subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'premium'], 
      default: 'free' 
    },
    listingsUsed: { 
      type: Number, 
      default: 0 
    },
    featuredListings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }]
  },
  image: { type: String, default: '' },
}, { timestamps: true });

// Create the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;