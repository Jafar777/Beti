import Link from 'next/link';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function PropertyCard({ property, showEdit = true, basePath = '/dashboard/listings', onCardClick ,onDelete}) {
  const router = useRouter();
  
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
      {/* Property Image */}
      {property.images && property.images.length > 0 ? (
        <div className="relative h-48 w-full">
          <Image 
            src={property.images[0]} 
            alt={property.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
          />
        </div>
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      
      {/* Property Details */}
      <div className="p-4">
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusClass}`}>
            {statusText}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1 truncate">{property.title}</h3>
        <p className="text-lg font-semibold text-[#375171] mb-3">${property.price.toLocaleString()}</p>
        
        {/* Property Features */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <span className="mr-3 flex items-center">
            <FaBed className="mr-1 text-[#375171]" />
            {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="mr-3 flex items-center">
            <FaBath className="mr-1 text-[#375171]" />
            {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
          <span className="flex items-center">
            <FaRulerCombined className="mr-1 text-[#375171]" />
            {property.area} m²
          </span>
        </div>
        
        {/* Location */}
        <p className="text-gray-600 text-sm mb-3 truncate">
          <i className="fa fa-map-marker-alt mr-1 text-[#375171]"></i>
          {property.location}
        </p>
        
        {/* Actions */}
        {showEdit && (
          <div className="flex space-x-2 pt-3 border-t border-gray-100">
            <Link 
              href={`${basePath}/${property._id}`}
              className="text-[#375171] border border-[#375171] px-3 py-1 rounded hover:bg-[#375171] hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
            <button 
              className="text-gray-500 hover:text-red-500 cursor-pointer"  
              onClick={(e) => handleDelete(e, property._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}