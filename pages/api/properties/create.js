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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await dbConnect();
    
    const user = await User.findById(token.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // REMOVED: Subscription check since users can now create unlimited properties
    
    const { 
      title, description, price, location, images, propertyType,
      bedrooms, bathrooms, area, latitude, longitude, pinLocation,
      contractType, ownershipType, governorate, city, district,
      age, airConditioning, privateParking, entrances,
      electricity, water, violations, rooftopOwnership, video
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

    // Create property with explicit type conversions
    const property = new Property({
      title,
      description,
      price: Number(price),
      location,
      images,
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area,
      latitude: Number(latitude),
      longitude: Number(longitude),
      pinLocation,
      age,
      airConditioning,
      privateParking: Boolean(privateParking),
      entrances: Number(entrances),
      electricity,
      water,
      violations: Boolean(violations),
      rooftopOwnership: String(rooftopOwnership),
      video,
      owner: user._id,
      contractType,
      ownershipType,
      governorate,
      city,
      district,
      status: 'active',
      isFeatured: false // Default to false, can be purchased separately
    });
    
    await property.save();
    
    // REMOVED: Subscription tracking code
    
    res.status(201).json(property);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    console.error("Property creation error:", error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}