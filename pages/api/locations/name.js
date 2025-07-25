import { getGovernorate, getCity, getDistrict } from '@/data/syriaLocations';

export default function handler(req, res) {
  const { governorate, city, district, lang } = req.query;
  
  const result = {
    governorate: governorate 
      ? (getGovernorate(governorate)?.name[lang || 'en'] || governorate)
      : '',
    city: city 
      ? (getCity(city)?.name[lang || 'en'] || city)
      : '',
    district: district 
      ? (getDistrict(district)?.name[lang || 'en'] || district)
      : ''
  };
  
  res.status(200).json(result);
}