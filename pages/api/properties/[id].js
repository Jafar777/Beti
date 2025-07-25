import Property from '@/models/Property';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  await dbConnect();
  
  const { id } = req.query;
  const token = await getToken({ req });
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
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
          contractType: property.contractType, // Add this
  ownershipType: property.ownershipType, // Add this
    isFeatured: property.isFeatured, // Add this

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
    else if (req.method === 'PUT') {
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Check ownership
      if (property.owner.toString() !== token.sub) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const { 
        title, description, price, location, 
        propertyType, bedrooms, bathrooms, area,
        latitude, longitude, pinLocation, images,
        contractType, ownershipType
      } = req.body;
      
      // Update property
      property.title = title;
      property.description = description;
      property.price = Number(price);
      property.location = location;
      property.propertyType = propertyType;
      property.bedrooms = Number(bedrooms);
      property.bathrooms = Number(bathrooms);
      property.area = area;
      property.latitude = Number(latitude);
      property.longitude = Number(longitude);
      property.pinLocation = pinLocation || {
        lat: Number(latitude),
        lng: Number(longitude)
      };
      property.images = images;
      property.contractType = contractType;
      property.ownershipType = ownershipType;
      
      await property.save();
      
      return res.status(200).json(property);
    }
    else if (req.method === 'DELETE') {
      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Check ownership
      if (property.owner.toString() !== token.sub) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await property.deleteOne();

      // Update user's listing count
      const user = await User.findById(token.sub);
      if (user) {
        user.subscription.listingsUsed = Math.max(0, user.subscription.listingsUsed - 1);
        await user.save();
      }

      return res.status(200).json({ message: 'Property deleted' });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}