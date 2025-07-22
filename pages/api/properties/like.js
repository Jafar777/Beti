import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import mongoose from 'mongoose';

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
    const user = await User.findById(token.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Ensure likedProperties exists
    user.likedProperties = user.likedProperties || [];
    
    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);
    const isLiked = user.likedProperties.some(id => id.equals(propertyObjectId));
    
    if (isLiked) {
      user.likedProperties = user.likedProperties.filter(
        id => !id.equals(propertyObjectId)
      );
    } else {
      user.likedProperties.push(propertyObjectId);
    }
    
    await user.save();
    
    // Convert to strings for client
    const likedPropertiesStrings = user.likedProperties.map(id => id.toString());
    
    return res.status(200).json({ 
      likedProperties: likedPropertiesStrings,
      isLiked: !isLiked 
    });
  } catch (error) {
    console.error('Like error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}