import Property from '@/models/Property';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  await dbConnect();
  
  const { id } = req.query;
  const token = await getToken({ req });
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

 if (req.method === 'GET') {
  const property = await Property.findById(id)
    .populate('owner', 'firstName lastName mobile image')
    .lean();

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  // Serialize properly
  const serializedProperty = {
    ...property,
    _id: property._id.toString(),
    owner: property.owner ? {
      ...property.owner,
      _id: property.owner._id.toString()
    } : null,
    pinLocation: property.pinLocation || {
      lat: property.latitude,
      lng: property.longitude
    }
  };

  return res.status(200).json(serializedProperty);
}
}