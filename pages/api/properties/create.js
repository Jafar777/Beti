// pages/api/properties/create.js
import cloudinary from 'cloudinary';
import Property from '@/models/Property';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getSession } from 'next-auth/react';
import { canCreateListing } from '@/utils/subscription';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await dbConnect();
    
    // Get user
    const user = await User.findById(session.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check subscription limits
    if (!canCreateListing(user)) {
      return res.status(403).json({ 
        error: 'Listing limit reached. Upgrade your plan.' 
      });
    }
    
    const { title, description, price, location, images, isFeatured } = req.body;
    
    // Upload images to Cloudinary
    const imageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'properties',
      });
      imageUrls.push(result.secure_url);
    }
    
    // Create property
    const property = new Property({
      title,
      description,
      price,
      location,
      images: imageUrls,
      owner: user._id,
      isFeatured: isFeatured && canFeatureListing(user)
    });
    
    await property.save();
    
    // Update user's listing count
    user.subscription.listingsUsed += 1;
    if (isFeatured && property.isFeatured) {
      user.subscription.featuredListings.push(property._id);
    }
    
    await user.save();
    
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}