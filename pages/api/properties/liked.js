import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Property from '@/models/Property';

export default async function handler(req, res) {
  const { userId } = req.query;
  
  await dbConnect();

  try {
    const user = await User.findById(userId).populate({
      path: 'likedProperties',
      model: Property,
      select: 'title price images location bedrooms bathrooms area propertyType contractType likes'
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return properties with likes
    return res.status(200).json(user.likedProperties || []);
  } catch (error) {
    console.error('Error fetching liked properties:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}