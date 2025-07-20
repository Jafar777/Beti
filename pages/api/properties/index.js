import Property from '@/models/Property';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  await dbConnect();
  
  try {
    if (req.method === 'GET') {
      if (req.query.myListings === 'true') {
        const token = await getToken({ req });
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const properties = await Property.find({ owner: token.sub })
          .populate('owner', 'firstName lastName mobile image')
          .lean();
        
        const serialized = properties.map(p => ({
          ...p,
          _id: p._id.toString(),
          owner: p.owner ? {
            ...p.owner,
            _id: p.owner._id.toString()
          } : null,
          pinLocation: p.pinLocation || {
            lat: p.latitude,
            lng: p.longitude
          }
        }));
        
        return res.status(200).json(serialized);
      } 
      else {
        // Remove status filter to show all pins
        const properties = await Property.find({})
          .populate('owner', 'firstName lastName mobile image')
          .lean();
        
        const serialized = properties.map(p => ({
          ...p,
          _id: p._id.toString(),
          owner: p.owner ? {
            ...p.owner,
            _id: p.owner._id.toString()
          } : null,
          pinLocation: p.pinLocation || {
            lat: p.latitude,
            lng: p.longitude
          }
        }));
        
        return res.status(200).json(serialized);
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}