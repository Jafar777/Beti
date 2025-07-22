'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import SinglePropertyMap from '@/components/SinglePropertyMap';
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { FaRegShareSquare } from 'react-icons/fa';


export default function PropertyDetails({ property }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const { language, translations } = useLanguage();
  const router = useRouter();
  const t = translations[language] || {};

  const images = property.images || [];
  const owner = property.owner || {};
  const pinLocation = property.pinLocation || {
    lat: property.latitude,
    lng: property.longitude
  };
  const [locationNames, setLocationNames] = useState({
    governorate: '',
    city: '',
    district: ''
  });

  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        const response = await fetch(`/api/locations/name?governorate=${property.governorate}&city=${property.city}&district=${property.district}`);
        const data = await response.json();
        setLocationNames(data);
      } catch (error) {
        console.error('Failed to fetch location names:', error);
      }
    };

    if (property.governorate) {
      fetchLocationNames();
    }
  }, [property]);


  // Check if property is already liked
  useEffect(() => {
    if (session && property && session.user?.likedProperties) {
      setIsLiked(session.user.likedProperties.includes(property._id));
    }
  }, [session, property]);

  // Check if current user is the owner - ADDED BACK THIS LINE
  const isOwner = session?.user?.id === (owner?._id || owner?.id)?.toString();

  const handleMessageOwner = () => {
    if (!session) {
      const callbackUrl = `/dashboard/chat?recipientId=${owner._id}&propertyId=${property._id}`;
      signIn(undefined, { callbackUrl });
    } else {
      router.push(`/dashboard/chat?recipientId=${owner._id}&propertyId=${property._id}`);
    }
  };

  const handleLike = async () => {
    if (!session) {
      signIn();
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch('/api/properties/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property._id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like property');
      }

      const data = await response.json();
      setIsLiked(data.isLiked);

      // CORRECTED: Proper session update
      await updateSession({
        user: {
          ...session.user,
          likedProperties: data.likedProperties
        }
      });

    } catch (error) {
      console.error('Like error:', error);
      alert(error.message || 'Failed to like property');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/properties/${property._id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(t.linkCopied || 'Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
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
                  className={`relative h-20 cursor-pointer border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'
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
      {/* Like Button */}
      {/* Action Buttons (below images, above info) */}
      <div className="flex justify-center gap-4 py-4 border-b border-gray-200">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLiked
            ? 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          aria-label={isLiked ? t.unlikeProperty || 'Unlike property' : t.likeProperty || 'Like property'}
        >
          {isLiked ? (
            <FaHeart className="text-xl" />
          ) : (
            <FaRegHeart className="text-xl" />
          )}
          <span>{isLiked ? t.liked || 'Liked' : t.like || 'Like'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          <FaRegShareSquare className="text-xl" />
          <span>{t.share || 'Share'}</span>
        </button>
      </div>

      {/* Property Details */}
      <div className="p-6 ">
        <div className='flex justify-center items-center'>
          <h1 className="text-3xl font-bold text-[#375171] mb-2">
            {property.title}
          </h1>

        </div>

        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {t.price}

          </span>
          <span className='text-2xl font-bold text-[#375171] mr-4'> ${property.price?.toLocaleString()}</span>
        </div>


        <div className='flex items-center mb-4'>
          <span className=" text-2xl font-bold text-[#375171] mr-4">
            {t.propertyType}


          </span>
          <span className=" text-2xl font-bold text-[#375171] mr-4">
            {
              property.propertyType === 'apartment' ? t.apartment || 'Apartment' :
                property.propertyType === 'villa' ? t.villa || 'Villa' :
                  property.propertyType === 'office' ? t.office || 'Office' :
                    property.propertyType === 'full_floor' ? t.full_floor || 'full Floor' :
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
                                          t.land || 'Land'

            }
          </span>


        </div>
        {/* Contract Type */}
        <div className='flex items-center mb-4'>
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {t.contractType || 'Contract Type'}
          </span>
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {property.contractType === 'rent'
              ? (t.rent || 'Rent')
              : property.contractType === 'sale'
                ? (t.sale || 'Sale')
                : (t.mortgage || 'Mortgage')}
          </span>
        </div>



        <div className="flex items-center mb-4">
          <span className='text-2xl font-bold text-[#375171] mr-4'>{t.bedroom}</span>
          <span><FaBed className="text-2xl font-bold text-[#375171] mr-4" /></span>
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {property.bedrooms} {property.bedrooms === 1 ? t.bedroom || 'Bedroom' : t.bedrooms || 'Bedrooms'}
          </span>
        </div>
        <div className='flex items-center mb-4'>
          <span className='text-2xl font-bold text-[#375171] mr-4'>{t.bathroom}</span>
          <span>  <FaBath className="text-2xl font-bold text-[#375171] mr-4" /></span>
          <span className="text-2xl font-bold text-[#375171] mr-4">

            {property.bathrooms} {property.bathrooms === 1 ? t.bathroom || 'Bathroom' : t.bathrooms || 'Bathrooms'}
          </span>
        </div>
        <div className='flex items-center mb-4'>
          <span className='text-2xl font-bold text-[#375171] mr-4'>{t.area}</span>
          <span><FaRulerCombined className="text-2xl font-bold text-[#375171] mr-4" /></span>
          <span className="text-2xl font-bold text-[#375171] mr-4">

            {property.area} {t.meter}
          </span>

        </div>
   <div className="flex items-center mb-4">
  <span className="text-2xl font-bold text-[#375171] mr-4">
    {t.location}
  </span>
  <div>
    <div className="text-2xl font-bold text-[#375171]">
      {locationNames.governorate} {/* Fixed: access property directly */}
    </div>
    <div className="text-xl text-[#375171]">
      {locationNames.city} - {/* Fixed: access property directly */}
      {locationNames.district} {/* Fixed: access property directly */}
    </div>
  </div>
</div>

        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#375171] mr-4">

            {t.location || 'Location'}
          </span>
          <span> <FaMapMarkerAlt className="text-2xl font-bold text-[#375171] mr-4" /></span>

          <span className="text-2xl font-bold text-[#375171] mr-4">
            {property.location}
          </span>
        </div>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#375171] mr-4">{t.ownershipType || 'Ownership Type'}</span>
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {property.ownershipType === 'green_deed' ? t.green_deed || 'Green Deed' :
              property.ownershipType === 'white_deed' ? t.white_deed || 'White Deed' :
                property.ownershipType === 'court_decision' ? t.court_decision || 'Court Decision' :
                  property.ownershipType === 'notary' ? t.notary || 'Notary' :
                    property.ownershipType === 'emiri' ? t.emiri || 'Emiri' :
                      property.ownershipType === 'reform' ? t.reform || 'Reform' :
                        property.ownershipType === 'charitable_endowment' ? t.charitable_endowment || 'Charitable Endowment' :
                          t.lineage_endowment || 'Lineage Endowment'}
          </span>
        </div>
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {t.description || 'Description'}
          </span>
          <span className="text-2xl font-bold text-[#375171] mr-4">
            {property.description}
          </span>
        </div>


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
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            {owner.image ? (
              <Image
                src={owner.image}
                alt={owner.firstName}
                width={64}
                height={64}
                className="object-cover object-center w-full h-full transition-transform duration-300 ease-in-out"
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

  );
}