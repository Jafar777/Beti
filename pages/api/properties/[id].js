import Property from '@/models/Property';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

// Define valid options for enums
const validACOptions = ['normal_split','inverter_split','central','concealed','window_ac','desert_ac','none'];
const validElectricityOptions = ['no_electricity','solar_panels','amber_subscription','only_government_electricity'];
const validWaterOptions = ['drinkable','non_drinkable','no_water'];
const validRooftopOptions = ['shared','private'];

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
        contractType: property.contractType,
        ownershipType: property.ownershipType,
        isFeatured: property.isFeatured,
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
        contractType, ownershipType, age,
        airConditioning,
        privateParking,
        entrances,
        electricity,
        water,
        violations,
        rooftopOwnership,
        video,
      } = req.body;

      // Validate enum fields
      if (!validACOptions.includes(airConditioning)) {
        return res.status(400).json({ error: 'Invalid air conditioning option' });
      }
      if (!validElectricityOptions.includes(electricity)) {
        return res.status(400).json({ error: 'Invalid electricity option' });
      }
      if (!validWaterOptions.includes(water)) {
        return res.status(400).json({ error: 'Invalid water option' });
      }
      if (!validRooftopOptions.includes(rooftopOwnership)) {
        return res.status(400).json({ error: 'Invalid rooftop ownership option' });
      }

      // Update property with explicit type conversions
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
      property.age = age;
      property.airConditioning = airConditioning;
      property.privateParking = Boolean(privateParking);
      property.entrances = Number(entrances);
      property.electricity = electricity;
      property.water = water;
      property.violations = Boolean(violations);
      property.rooftopOwnership = rooftopOwnership;
      property.video = video;
      
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