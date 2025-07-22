// pages/api/properties/create.js
import Property from '@/models/Property';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import { canCreateListing, canFeatureListing } from '@/utils/subscription';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use getToken to retrieve the session
  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await dbConnect();
    
    // Get user using token.sub (user ID)
    const user = await User.findById(token.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check subscription limits
    if (!canCreateListing(user)) {
      return res.status(403).json({ 
        error: 'Listing limit reached. Upgrade your plan.' 
      });
    }
    
    const { 
      title, 
      description, 
      price, 
      location, 
      images, 
      propertyType,
      bedrooms,
      bathrooms,
      area,
      latitude,
      longitude,
      pinLocation,
        contractType,
    ownershipType ,
      governorate,
  city,
  district


    } = req.body;
    
    // Create property
    const property = new Property({
      title,
      description,
      price,
      location,
      images,
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area,
      latitude,
      longitude,
      pinLocation,
      owner: user._id,
        contractType,
    ownershipType,
      governorate,
  city,
  district,
      isFeatured: canFeatureListing(user)
    });
    
    await property.save();
    
    // Update user's listing count
    user.subscription.listingsUsed += 1;
    if (property.isFeatured) {
      user.subscription.featuredListings.push(property._id);
    }
    
    await user.save();
    
    res.status(201).json(property);
  } catch (error) {
      // Add specific validation error handling
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ error: errors.join(', ') });
  }
    console.error("Property creation error:", error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}