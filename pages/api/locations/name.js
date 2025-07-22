import { getGovernorate, getCity, getDistrict } from '@/data/syriaLocations';

export default function handler(req, res) {
  const { governorate, city, district } = req.query;
  
  const result = {
    governorate: governorate ? getGovernorate(governorate)?.name || governorate : '',
    city: city ? getCity(city)?.name || city : '',
    district: district ? getDistrict(district)?.name || district : ''
  };
  
  res.status(200).json(result);
}