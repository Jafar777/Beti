import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Property from '@/models/Property';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  
  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query;
  
  // Verify user owns this data
  if (token.sub !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const user = await User.findById(userId).populate({
      path: 'likedProperties',
      model: Property,
      select: '_id title description price location images propertyType bedrooms bathrooms area pinLocation'
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Serialize properties
    const likedProperties = user.likedProperties.map(prop => ({
      ...prop._doc,
      _id: prop._id.toString(),
      owner: prop.owner ? prop.owner.toString() : null,
      pinLocation: prop.pinLocation || {
        lat: prop.latitude,
        lng: prop.longitude
      }
    }));

    return res.status(200).json(likedProperties);
  } catch (error) {
    console.error('Error fetching liked properties:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}