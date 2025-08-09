import Link from 'next/link';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useLanguage } from "@/context/LanguageContext";

export default function PropertyCard({ property, showEdit = true, basePath = '/dashboard/listings', onCardClick ,onDelete}) {
  const router = useRouter();
    const { language, translations } = useLanguage();
    const t = translations[language] || {};
  // Determine status text and class
  const statusText = property.status || 'active';
  let statusClass = '';
  switch (statusText) {
    case 'active':
      statusClass = 'bg-green-100 text-green-800';
      break;
    case 'pending':
      statusClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'draft':
      statusClass = 'bg-gray-100 text-gray-800';
      break;
    default:
      statusClass = 'bg-blue-100 text-blue-800';
  }

   const handleDelete = async (e, propertyId) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Call the onDelete callback from parent
          if (onDelete) {
            onDelete(propertyId);
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete property');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.message || 'Failed to delete property');
      }
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onCardClick && onCardClick(property)}
    >
        {/* Image with contract tag */}
      <div className="relative h-60 w-full">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]} 
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ):(
          <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
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
          <span className="text-sm line-clamp-1">
            {property.location}
          </span>
        </div>

        {/* Property features */}
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center text-gray-600">
            <FaBed className="mr-1 text-[#375171]" />
            <span className="text-sm mr-2">
              {property.bedrooms}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaBath className="mr-1 text-[#375171]" />
            <span className="text-sm mr-2">
              {property.bathrooms} 
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaRulerCombined className="mr-1 text-[#375171]" />
            <span className="text-sm mr-2">
              {property.area} m²
            </span>
          </div>
        </div>

        {/* Edit/Delete Buttons */}
        {showEdit && (
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
            <Link 
              href={`${basePath}/${property._id}`}
              className="flex items-center text-[#375171] hover:text-blue-700 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEdit className="mr-1 ml-1" /> {t.edit || 'Edit'}
            </Link>
            <button 
              className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => handleDelete(e, property._id)}
            >
              <FaTrash className="mr-1 ml-1" /> {t.delete || 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}