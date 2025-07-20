'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import SinglePropertyMap from '@/components/SinglePropertyMap';
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PropertyDetails({ property }) {
  const [activeImage, setActiveImage] = useState(0);
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const router = useRouter();
  const t = translations[language] || {};
  
  const images = property.images || [];
  const owner = property.owner || {};
  const pinLocation = property.pinLocation || {
    lat: property.latitude,
    lng: property.longitude
  };
  
  // Check if current user is the owner
  const isOwner = session?.user?.id === owner?._id?.toString();

  const handleMessageOwner = () => {
    if (!session) {
      // Redirect to login with callback URL to the chat page
      const callbackUrl = `/dashboard/chat?recipientId=${owner._id}&propertyId=${property._id}`;
      signIn(undefined, { callbackUrl });
    } else {
      // Go directly to chat if logged in
      router.push(`/dashboard/chat?recipientId=${owner._id}&propertyId=${property._id}`);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative">
        {images.length > 0 ? (
          <>
            <div className="relative h-96 md:h-[500px]">
              <Image 
                src={images[activeImage]} 
                alt={property.title} 
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2 p-4">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`relative h-20 cursor-pointer border-2 ${
                    activeImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image 
                    src={img} 
                    alt={`${t.image || 'Image'} ${index + 1}`} 
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-200 w-full h-96 flex items-center justify-center">
            <span className="text-gray-500">{t.noImages || 'No images available'}</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#375171] mb-2">
          {property.title}
        </h1>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#375171] mr-4">
            ${property.price?.toLocaleString()}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
            {property.propertyType === 'apartment' ? t.apartment || 'Apartment' : 
             property.propertyType === 'villa' ? t.villa || 'Villa' : 
             property.propertyType === 'office' ? t.office || 'Office' : 
             t.land || 'Land'}
          </span>
        </div>
        
        <div className="flex items-center space-x-6 mb-6 text-gray-600">
          <div className="flex items-center">
            <FaBed className="mr-2 text-[#375171]" />
            {property.bedrooms} {property.bedrooms === 1 ? t.bedroom || 'Bedroom' : t.bedrooms || 'Bedrooms'}
          </div>
          <div className="flex items-center">
            <FaBath className="mr-2 text-[#375171]" />
            {property.bathrooms} {property.bathrooms === 1 ? t.bathroom || 'Bathroom' : t.bathrooms || 'Bathrooms'}
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-2 text-[#375171]" />
            {property.area} m²
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#375171] mb-2">
            {t.description || 'Description'}
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {property.description}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#375171] mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            {t.location || 'Location'}
          </h2>
          <p className="text-gray-700 mb-4">
            {property.location} 
            <span className="ml-2 text-sm text-gray-500">
              ({pinLocation.lat?.toFixed(6)}, {pinLocation.lng?.toFixed(6)})
            </span>
          </p>
          
          <div className="h-96 rounded-lg overflow-hidden relative">
            <SinglePropertyMap 
              position={pinLocation} 
              zoom={15} 
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-[#375171] mb-4">
            {t.contactOwner || 'Contact Owner'}
          </h2>
          
          {isOwner ? (
            // Show full info to owner
            <div className="flex items-center">
              {owner.image ? (
                <Image 
                  src={owner.image} 
                  alt={owner.firstName} 
                  width={64}
                  height={64}
                  className="rounded-full mr-4"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <span className="text-gray-500 text-2xl">👤</span>
                </div>
              )}
              <div>
                <p className="font-medium">
                  {owner.firstName} {owner.lastName}
                </p>
                <p className="text-gray-600">
                  {owner.mobile}
                </p>
              </div>
            </div>
          ) : (
            // For non-owners, show contact option without sensitive info
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">
                {t.interestedInProperty || 'Interested in this property?'}
              </p>
              <button 
                             onClick={handleMessageOwner}
                className="flex items-center bg-[#375171] text-white px-6 py-3 rounded-lg hover:bg-[#2d4360]"
              >
                <FaEnvelope className="mr-2" />
                <span>{t.messageOwner || 'Message Owner'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}