import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import mongoose from 'mongoose';
import Property from '@/models/Property';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  
  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { propertyId } = req.body;
  
  try {
    // Find user and property in parallel
    const [user, property] = await Promise.all([
      User.findById(token.sub),
      Property.findById(propertyId)
    ]);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    // Convert to ObjectId for comparison
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    
    // Check if already liked
    const wasLiked = user.likedProperties.some(id => id.equals(propertyObjectId));
    
    // Update user's liked properties
    if (wasLiked) {
      user.likedProperties = user.likedProperties.filter(
        id => !id.equals(propertyObjectId)
      );
    } else {
      user.likedProperties.push(propertyObjectId);
    }
    
    // Update property like count
    property.likes = wasLiked ? property.likes - 1 : property.likes + 1;
    
    // Save both in parallel
    await Promise.all([user.save(), property.save()]);
    
    // Return updated state
    return res.status(200).json({ 
      likedProperties: user.likedProperties.map(id => id.toString()),
      isLiked: !wasLiked,
      updatedLikes: property.likes
    });
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}