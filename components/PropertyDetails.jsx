'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaEnvelope, FaRegHeart, FaHeart, FaRegShareSquare, FaWhatsapp } from 'react-icons/fa';
import SinglePropertyMap from '@/components/SinglePropertyMap';
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { FaEye } from 'react-icons/fa';
import { TbContract } from "react-icons/tb";
import { BiSolidDoorOpen } from "react-icons/bi";
import { MdElectricBolt } from "react-icons/md";
import { IoWater } from "react-icons/io5";
import { TbAirConditioning } from "react-icons/tb";
import { FaSquareParking } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { RiBillLine } from "react-icons/ri";
import { PiSolarRoofFill } from "react-icons/pi";
import { MdOutlineDescription } from "react-icons/md";
import { MdOutlineLocalPolice } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { getLocationName } from '@/data/syriaLocations';



export default function PropertyDetails({ property, isLikedByCurrentUser }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const router = useRouter();
  const t = translations[language] || {};

  // Initialize both states from server data
  const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
  const [likesCount, setLikesCount] = useState(property.likes || 0);

  // Sync likesCount with isLiked state on refresh
  useEffect(() => {
    if (isLikedByCurrentUser) {
      setLikesCount(prev => isLikedByCurrentUser ? prev : prev + 1);
    }
  }, [isLikedByCurrentUser]);
  useEffect(() => {
    // Dispatch event to hide loading overlay
    window.dispatchEvent(new CustomEvent('routechangecomplete'));

    return () => {
      // Cleanup if needed
    };
  }, []);

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

  useEffect(() => {
    // Only track views for non-owners and non-logged-in users
    if (!session || (session && session.user.id !== property.owner?._id?.toString())) {
      const trackView = async () => {
        try {
          await fetch('/api/properties/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId: property._id })
          });
        } catch (error) {
          console.error('View tracking failed:', error);
        }
      };

      trackView();
    }
  }, [property._id, session, property.owner?._id]);
  // Check if current user is the owner
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
    if (isLiking) return;

    setIsLiking(true);
    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const response = await fetch('/api/properties/like', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property._id })
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like property');
      }

      const data = await response.json();

      // Update state from server response
      setIsLiked(data.isLiked);
      setLikesCount(data.updatedLikes);

    } catch (error) {
      // Revert on error
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
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

const handleWhatsApp = () => {
  if (!session) {
    signIn();
    return;
  }

  const message = encodeURIComponent(
    `Hello, I'm interested in your property: ${property.title} (${window.location.origin}/properties/${property._id})`
  );

  // Ensure no leading zero in the mobile number
  const formattedMobile = owner.mobile.replace(/^0+/, '');
  
  window.open(`https://wa.me/963${formattedMobile}?text=${message}`, '_blank');
};


  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
      {/* Image Gallery */}
      <div className="relative">
        {images.length > 0 ? (
          <>
            <div className="relative h-72 md:h-[500px]">
              <Image
                src={images[activeImage]}
                alt={property.title}
                fill
                className="object-cover rounded-t-xl"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative h-20 cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === index ? 'border-blue-500' : 'border-transparent'
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
          <div className="bg-gray-200 w-full h-72 flex items-center justify-center rounded-t-xl">
            <span className="text-gray-500">{t.noImages || 'No images available'}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 py-4 px-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors cursor-pointer ${isLiked
            ? 'bg-red-50 text-red-600 border border-red-200'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span>{isLiked ? t.liked || 'Liked' : t.like || 'Like'}</span>
          <span className="text-sm font-medium">({likesCount})</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 cursor-pointer"
        >
          <FaRegShareSquare />
          <span>{t.share || 'Share'}</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-full">
          <FaEye />
          <span>{property.views || 0} {t.views || 'Views'}</span>
        </div>
      </div>

      {/* Property Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {property.title}
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <FaMapMarkerAlt className="mr-1 text-blue-600" />
              <span>
                <span className='mr-1 ml-1'>{getLocationName(property.district, 'district', language)} -</span>
                <span className='mr-1 ml-1'>{getLocationName(property.governorate, 'governorate', language)} -</span>
                                <span className='mr-1 ml-1'>{getLocationName(property.city, 'city', language)}</span>


              </span>
            </div>
          </div>

          <div className="bg-blue-50 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg font-medium text-blue-800 mr-2 ml-2">
                {t.price}:
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${property.price?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center mt-1">
              <TbContract className="text-blue-600 mr-2 ml-2" />
              <span className="font-medium text-blue-800">
                {property.contractType === 'rent' ? t.rent :
                  property.contractType === 'sale' ? t.sale : t.mortgage}
              </span>
            </div>
          </div>
        </div>

        {/* Property Type Badge */}
        <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 mb-6">
          {property.propertyType === 'apartment' ? t.apartment :
            property.propertyType === 'villa' ? t.villa :
              property.propertyType === 'office' ? t.office :
                property.propertyType === 'full_floor' ? t.full_floor :
                  property.propertyType === 'full_building' ? t.full_building :
                    property.propertyType === 'shop' ? t.shop :
                      property.propertyType === 'house' ? t.house :
                        property.propertyType === 'arabian_house' ? t.arabian_house :
                          property.propertyType === 'farm' ? t.farm :
                            property.propertyType === 'warehouse' ? t.warehouse :
                              property.propertyType === 'seaside_chalet' ? t.seaside_chalet :
                                property.propertyType === 'palace' ? t.palace :
                                  property.propertyType === 'showroom' ? t.showroom :
                                    property.propertyType === 'wedding_hall' ? t.wedding_hall :
                                      t.land}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Description */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4 pb-2 border-b border-gray-200">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <MdOutlineDescription className="text-blue-600" />
              </span>
              {t.description || 'Description'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4 pb-2 border-b border-gray-200">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <IoIosStar className="text-blue-600" />
              </span>
              {t.keyFeatures || 'Key Features'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaBed className="text-xl text-blue-600 mr-3 ml-3" />
                <div>
                  <div className="text-gray-500 text-sm">{t.bedrooms}</div>
                  <div className="text-gray-950 mr-2 font-medium">{property.bedrooms}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaBath className="text-xl text-blue-600 mr-3 ml-3" />
                <div>
                  <div className="text-gray-500 text-sm">{t.bathrooms}</div>
                  <div className="text-gray-950 mr-2 font-medium">{property.bathrooms}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaRulerCombined className="text-xl text-blue-600 mr-3 ml-3" />
                <div>
                  <div className="text-gray-500 text-sm">{t.area}</div>
                  <div className="text-gray-950 mr-2 font-medium">{property.area} {t.meter}</div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <SlCalender className="text-xl text-blue-600 mr-3 ml-3" />
                <div>
                  <div className="text-gray-500 text-sm">{t.propertyAge}</div>
                  <div className="text-gray-950 mr-2 font-medium">{property.age}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Video */}
          {property.video && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4 pb-2 border-b border-gray-200">
                <span className="bg-blue-100 p-2 rounded-full mr-2">
                  <FaRegShareSquare className="text-blue-600" />
                </span>
                {t.videoTour || 'Video Tour'}
              </h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <video
                  src={property.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4 pb-2 border-b border-gray-200">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <FaMapMarkerAlt className="text-blue-600" />
              </span>
              {t.location || 'Location'}
            </h2>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
              <SinglePropertyMap
                position={pinLocation}
                zoom={15}
              />
            </div>
            <p className="mt-3 text-gray-600 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Ownership Details - Fixed Alignment */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <TbContract className="text-blue-600" />
              </span>
              {t.ownershipDetails || 'Ownership Details'}
            </h2>

            <div className="space-y-4">
              {/* Ownership Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TbContract className="text-blue-600 mr-2 ml-2" />
                  <span className="text-gray-600">{t.ownershipType}:</span>
                </div>
                <span className="text-gray-950 font-medium">
                  {property.ownershipType === 'green_deed' ? t.green_deed :
                    property.ownershipType === 'white_deed' ? t.white_deed :
                      property.ownershipType === 'court_decision' ? t.court_decision :
                        property.ownershipType === 'notary' ? t.notary :
                          property.ownershipType === 'emiri' ? t.emiri :
                            property.ownershipType === 'reform' ? t.reform :
                              property.ownershipType === 'charitable_endowment' ? t.charitable_endowment :
                                t.lineage_endowment}
                </span>
              </div>

              {/* Entrances */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BiSolidDoorOpen className="text-blue-600 mr-2 ml-2" />
                  <span className="text-gray-600">{t.entrances}:</span>
                </div>
                <span className="text-gray-950 font-medium">{property.entrances}</span>
              </div>

              {/* Violations */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center">
                  <MdOutlineLocalPolice className="text-blue-600 mr-2 ml-2" />
                  <span className="text-gray-600">{t.violations}:</span>
                </div>
                <span className="font-medium text-gray-950">
                  {property.violations ? t.yes : t.no}
                </span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <MdElectricBolt className="text-blue-600 " />
              </span>
              {t.amenities || 'Amenities'}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <MdElectricBolt className="text-blue-500 mr-3" />
                <span className="text-gray-600 flex-grow">{t.electricity}:</span>
                <span className="font-medium text-gray-950">
                  {property.electricity === 'no_electricity' ? t.noElectricity :
                    property.electricity === 'solar_panels' ? t.solarPanels :
                      property.electricity === 'amber_subscription' ? t.amberSubscription :
                        t.govElectricity}
                </span>
              </div>

              <div className="flex items-center">
                <IoWater className="text-blue-500 mr-3 ml-3" />
                <span className="text-gray-600 flex-grow">{t.water}:</span>
                <span className="font-medium text-gray-950">
                  {property.water === 'no_water' ? t.noWater :
                    property.water === 'non_drinkable' ? t.nonDrinkable :
                      t.drinkable}
                </span>
              </div>

              <div className="flex items-center">
                <TbAirConditioning className="text-blue-500 mr-3 ml-3" />
                <span className="text-gray-600 flex-grow">{t.airConditioning}:</span>
                <span className="font-medium text-gray-950">
                  {property.airConditioning === 'none' ? t.none :
                    property.airConditioning === 'normal_split' ? t.normalSplit :
                      property.airConditioning === 'inverter_split' ? t.inverterSplit :
                        property.airConditioning === 'central' ? t.central :
                          property.airConditioning === 'concealed' ? t.concealed :
                            property.airConditioning === 'window_ac' ? t.windowAC :
                              t.desertAC}
                </span>
              </div>

              <div className="flex items-center">
                <FaSquareParking className="text-blue-500 mr-3 ml-3" />
                <span className="text-gray-600 flex-grow">{t.privateParking}:</span>
                <span className="font-medium text-gray-950">
                  {property.privateParking ? t.yes : t.no}
                </span>
              </div>

              <div className="flex items-center">
                <PiSolarRoofFill className="text-blue-500 mr-3 ml-3" />
                <span className="text-gray-600 flex-grow">{t.rooftopOwnership}:</span>
                <span className="font-medium text-gray-950">
                  {property.rooftopOwnership === 'shared' ? t.shared : t.private}
                </span>
              </div>
            </div>
          </div>


          {/* Owner Contact */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
              <span className="bg-blue-100 p-2 rounded-full mr-3 ml-3">
                <FaEnvelope className="text-blue-600" />
              </span>
              {t.contactOwner || 'Contact Owner'}
            </h2>

            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ml-4 border-2 border-blue-200">
                {owner.image ? (
                  <Image
                    src={owner.image}
                    alt={owner.firstName}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-lg text-gray-950">
                  {owner.firstName} {owner.lastName}
                </p>

              </div>
            </div>

            <div className="space-y-3">

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                <span className='mr-2'>{t.whatsapp || 'Contact via WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
