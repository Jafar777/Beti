// pages/api/properties/view.js
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();
  
  const { propertyId } = req.body;
  
  try {
    // Update the view count
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    return res.status(200).json({ 
      success: true,
      views: property.views 
    });
  } catch (error) {
    console.error('View tracking error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}