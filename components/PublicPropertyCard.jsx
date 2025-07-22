// components/PublicPropertyCard.jsx
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { getLocationName } from '@/data/syriaLocations';


export default function PublicPropertyCard({ property }) {
  const { language, translations } = useLanguage();
  const router = useRouter();
  const t = translations[language] || {};
  
  // Get first image or placeholder
  const mainImage = property.images?.length > 0 
    ? property.images[0] 
    : '/placeholder.jpg';
  
  // Contract type styling
  const contractStyles = {
    sale: {
      bg: 'bg-red-600',
      text: t.sale || 'Sale'
    },
    rent: {
      bg: 'bg-blue-600',
      text: t.rent || 'Rent'
    },
    mortgage: {
      bg: 'bg-green-600',
      text: t.mortgage || 'Mortgage'
    }
  };
  
  const contractType = property.contractType || 'sale';
  const contractStyle = contractStyles[contractType] || contractStyles.sale;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() => router.push(`/properties/${property._id}`)}
    >
      {/* Image with contract tag */}
      <div className="relative h-60 w-full">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Contract type badge */}
        <div className={`absolute top-3 left-3 ${contractStyle.bg} text-white px-3 py-1 rounded-md font-bold text-sm shadow-lg`}>
          {contractStyle.text}
        </div>
      </div>
      
      {/* Property details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {property.title}
          </h3>
          <span className="text-lg font-bold text-[#375171] whitespace-nowrap">
            ${property.price?.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-1 text-sm text-[#375171]" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        {/* Property features */}
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center text-gray-600">
            <FaBed className="mr-1 text-[#375171]" />
            <span className="text-sm">
              {property.bedrooms} {property.bedrooms === 1 ? t.bedroom || 'Bed' : t.bedrooms || 'Beds'}
            </span>
          </div>
              <div className="flex items-center text-gray-600 mb-3">
      <FaMapMarkerAlt className="mr-1 text-sm text-[#375171]" />
      <span className="text-sm line-clamp-1">
        {getLocationName(property.district, 'district', language)}
      </span>
    </div>
    
          
          <div className="flex items-center text-gray-600">
            <FaBath className="mr-1 text-[#375171]" />
            <span className="text-sm">
              {property.bathrooms} {property.bathrooms === 1 ? t.bathroom || 'Bath' : t.bathrooms || 'Baths'}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaRulerCombined className="mr-1 text-[#375171]" />
            <span className="text-sm">
              {property.area} m²
            </span>
          </div>
        </div>
        
        {/* Property type */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
            {property.propertyType === 'apartment' ? t.apartment || 'Apartment' : 
             property.propertyType === 'villa' ? t.villa || 'Villa' : 
             property.propertyType === 'office' ? t.office || 'Office' : 
             property.propertyType === 'full_floor' ? t.full_floor || 'Full Floor' :
             property.propertyType === 'full_building' ? t.full_building || 'Full Building' :
             property.propertyType === 'shop' ? t.shop || 'Shop' :
             property.propertyType === 'house' ? t.house || 'House' :
             property.propertyType === 'arabian_house' ? t.arabian_house || 'Arabian House' :
             property.propertyType === 'farm' ? t.farm || 'Farm' :
             property.propertyType === 'warehouse' ? t.warehouse || 'Warehouse' :
             property.propertyType === 'seaside_chalet' ? t.seaside_chalet || 'Seaside Chalet' :
             property.propertyType === 'palace' ? t.palace || 'Palace' :
             property.propertyType === 'showroom' ? t.showroom || 'Showroom' :
             property.propertyType === 'wedding_hall' ? t.wedding_hall || 'Wedding Hall' :
             t.land || 'Land'}
          </span>
        </div>
      </div>
    </div>
  );
}