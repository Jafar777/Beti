'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LocationPickerMap from '@/components/LocationPickerMap';
import { 
  FaTrash, FaHome, FaFileContract, FaPlug, FaWater, 
  FaMapMarkerAlt, FaImages, FaFileAlt, FaBed, 
  FaBath, FaRulerCombined, FaCheck 
} from "react-icons/fa";
import { TbAirConditioning, TbParking, TbContract } from "react-icons/tb";
import { MdOutlineLocalPolice, MdOutlineDescription } from "react-icons/md";
import { PiSolarRoofFill, PiCoin } from "react-icons/pi";
import { SlCalender } from "react-icons/sl";
import { BiSolidDoorOpen } from 'react-icons/bi';
import { IoIosVideocam } from "react-icons/io";

export default function EditListingPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rentPeriod: 'monthly',
    location: '',
    propertyType: 'apartment',
    propertyStatus: 'intact',
    decorationType: 'normal_coating',
    includeVideo: false,
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    contractType: 'sale',
    ownershipType: 'green_deed',
    latitude: 33.510414,
    longitude: 36.278336,
    pinLocation: { lat: 33.510414, lng: 36.278336 },
    governorate: '',
    city: '',
    district: '',
    images: [],
    age: '',
    airConditioning: 'none',
    privateParking: 'no',
    entrances: 1,
    electricity: 'only_government_electricity',
    water: 'non_drinkable',
    violations: 'no',
    rooftopOwnership: 'shared',
    video: '',
  });
  
  const [locationsData, setLocationsData] = useState({ governorates: [] });
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  // Get available locations
  const selectedGovernorate = locationsData.governorates.find(
    gov => gov.id === formData.governorate
  );
  const availableCities = selectedGovernorate
    ? selectedGovernorate.cities
    : [];
  const selectedCity = availableCities.find(
    city => city.id === formData.city
  );
  const availableDistricts = selectedCity
    ? selectedCity.districts
    : [];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        const data = await response.json();
        setLocationsData(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const data = await response.json();
        setFormData({
          ...data,
          pinLocation: data.pinLocation || {
            lat: data.latitude,
            lng: data.longitude
          },
          // Ensure boolean values are converted to string for selects
          privateParking: data.privateParking ? 'yes' : 'no',
          violations: data.violations ? 'yes' : 'no',
          includeVideo: !!data.video
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError(t.networkError || 'Failed to load property');
        setLoading(false);
      }
    };
    
    fetchLocations();
    if (session && id) {
      fetchProperty();
    }
  }, [session, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationSelect = (position) => {
    setFormData(prev => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng,
      pinLocation: position 
    }));
  };
  
  const openCloudinaryWidget = () => {
    cloudinaryRef.current = window.cloudinary;
    
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera'],
        multiple: true,
        maxFiles: 10,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
        maxImageFileSize: 5000000,
        cropping: true,
        croppingAspectRatio: 16/9,
        showSkipCropButton: false
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result.info.secure_url]
          }));
        }
      }
    );
    
    widgetRef.current.open();
  };
  
  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );
      
      const data = await response.json();
      setFormData(prev => ({ 
        ...prev, 
        video: data.secure_url,
        includeVideo: true
      }));
    } catch (error) {
      console.error('Video upload error:', error);
      setError(t.videoUploadError || 'Failed to upload video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Convert select values to boolean where needed
      const submissionData = {
        ...formData,
        privateParking: formData.privateParking === 'yes',
        violations: formData.violations === 'yes',
        // Convert to numbers
        area: Number(formData.area),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        entrances: Number(formData.entrances)
      };

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }
      
      router.push('/dashboard/listings');
    } catch (err) {
      setError(err.message || t.networkError || 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || loadingLocations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#375171] mb-8 flex items-center">
        <FaHome className="mr-3 ml-3 text-blue-600" />
        {t.editProperty || 'Edit Property'}
      </h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Property Information Section */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <FaHome className="text-blue-600 mr-3 ml-3" />
            {t.propertyInformation || 'Property Information'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.title || 'Property Title'} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.contractType} *
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="rent">{t.rent}</option>
                <option value="sale">{t.sale}</option>
                <option value="mortgage">{t.mortgage}</option>
              </select>
            </div>

            <div className={formData.contractType === 'rent' ? 'col-span-2 grid grid-cols-2 gap-6' : ''}>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  {formData.contractType === 'rent' 
                    ? t.rentPrice || 'Rent Price (USD)' 
                    : t.price || 'Price (USD)'} *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              
              {formData.contractType === 'rent' && (
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    {t.rentPeriod || 'Rent Period'} *
                  </label>
                  <select
                    name="rentPeriod"
                    value={formData.rentPeriod}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="daily">{t.daily || 'Daily'}</option>
                    <option value="weekly">{t.weekly || 'Weekly'}</option>
                    <option value="monthly">{t.monthly || 'Monthly'}</option>
                    <option value="yearly">{t.yearly || 'Yearly'}</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.propertyType || 'Property Type'} *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="apartment">{t.apartment || 'Apartment'}</option>
                <option value="villa">{t.villa || 'Villa'}</option>
                <option value="office">{t.office || 'Office'}</option>
                <option value="land">{t.land || 'Land'}</option>
                <option value="full_floor">{t.full_floor || 'Full Floor'}</option>
                <option value="full_building">{t.full_building || 'Full Building'}</option>
                <option value="shop">{t.shop || 'Shop'}</option>
                <option value="house">{t.house || 'House'}</option>
                <option value="arabian_house">{t.arabian_house || 'Arabian House'}</option>
                <option value="farm">{t.farm || 'Farm'}</option>
                <option value="warehouse">{t.warehouse || 'Warehouse'}</option>
                <option value="seaside_chalet">{t.seaside_chalet || 'Seaside Chalet'}</option>
                <option value="palace">{t.palace || 'Palace'}</option>
                <option value="wedding_hall">{t.wedding_hall || 'Wedding Hall'}</option>
                <option value="showroom">{t.showroom || 'Showroom'}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.propertyStatus || 'Property Status'} *
              </label>
              <select
                name="propertyStatus"
                value={formData.propertyStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="demolished">{t.demolished || 'مهدوم انقاض'}</option>
                <option value="unbuilt">{t.unbuilt || 'غير مبني'}</option>
                <option value="intact">{t.intact || 'سليم'}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.decorationType || 'Decoration Type'} *
              </label>
              <select
                name="decorationType"
                value={formData.decorationType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="bare_bones">{t.bare_bones || 'غير مكسي عالعضم'}</option>
                <option value="old_coating">{t.old_coating || 'اكساء قديم'}</option>
                <option value="normal_coating">{t.normal_coating || 'اكساء عادي'}</option>
                <option value="deluxe_coating">{t.deluxe_coating || 'اكساء ديلوكس'}</option>
                <option value="super_deluxe_coating">{t.super_deluxe_coating || 'اكساء غالي سوبر ديلوكس'}</option>
              </select>
            </div>
 
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaBed className="inline mr-2 ml-2 text-blue-600" />
                {t.bedrooms || 'Bedrooms'} *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaBath className="inline mr-2 ml-2 text-blue-600" />
                {t.bathrooms || 'Bathrooms'} *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaRulerCombined className="inline mr-2 ml-2 text-blue-600" />
                {t.area || 'Area (m²)'} *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <SlCalender className="inline mr-2 ml-2 text-blue-600" />
                {t.propertyAge || 'Property Age'} *
              </label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Ownership Details Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <TbContract className="text-blue-600 mr-3 ml-3" />
            {t.ownershipDetails || 'Ownership Details'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.ownershipType} *
              </label>
              <select
                name="ownershipType"
                value={formData.ownershipType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="green_deed">{t.green_deed}</option>
                <option value="white_deed">{t.white_deed}</option>
                <option value="court_decision">{t.court_decision}</option>
                <option value="notary">{t.notary}</option>
                <option value="emiri">{t.emiri}</option>
                <option value="reform">{t.reform}</option>
                <option value="charitable_endowment">{t.charitable_endowment}</option>
                <option value="lineage_endowment">{t.lineage_endowment}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <MdOutlineLocalPolice className="inline mr-2 ml-2 text-blue-600" />
                {t.violations} *
              </label>
              <select
                name="violations"
                value={formData.violations}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="no">{t.no}</option>
                <option value="yes">{t.yes}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <BiSolidDoorOpen className="inline mr-2 ml-2 text-blue-600" />
                {t.entrances || 'Number of Entrances'} *
              </label>
              <input
                type="number"
                name="entrances"
                value={formData.entrances}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <FaPlug className="text-blue-600 mr-3 ml-3" />
            {t.amenities || 'Amenities'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <TbAirConditioning className="inline mr-2 ml-2 text-blue-600" />
                {t.airConditioning || 'Air Conditioning'} *
              </label>
              <select
                name="airConditioning"
                value={formData.airConditioning}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="none">{t.none || 'None'}</option>
                <option value="normal_split">{t.normalSplit || 'Normal Split'}</option>
                <option value="inverter_split">{t.inverterSplit || 'Inverter Split'}</option>
                <option value="central">{t.central || 'Central'}</option>
                <option value="concealed">{t.concealed || 'Concealed'}</option>
                <option value="window_ac">{t.windowAC || 'Window AC'}</option>
                <option value="desert_ac">{t.desertAC || 'Desert AC'}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaPlug className="inline mr-2 ml-2 text-blue-600" />
                {t.electricity || 'Electricity'} *
              </label>
              <select
                name="electricity"
                value={formData.electricity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="no_electricity">{t.noElectricity || 'No Electricity'}</option>
                <option value="solar_panels">{t.solarPanels || 'Solar Panels'}</option>
                <option value="amber_subscription">{t.amberSubscription || 'Amber Subscription'}</option>
                <option value="only_government_electricity">
                  {t.govElectricity || 'Government Electricity'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaWater className="inline mr-2 ml-2 text-blue-600" />
                {t.water || 'Water'} *
              </label>
              <select
                name="water"
                value={formData.water}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="no_water">{t.noWater || 'No Water'}</option>
                <option value="non_drinkable">{t.nonDrinkable || 'Non-Drinkable'}</option>
                <option value="drinkable">{t.drinkable || 'Drinkable'}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <PiSolarRoofFill className="inline mr-2 ml-2 text-blue-600" />
                {t.rooftopOwnership || 'Rooftop Ownership'} *
              </label>
              <select
                name="rooftopOwnership"
                value={formData.rooftopOwnership}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="shared">{t.shared || 'Shared'}</option>
                <option value="private">{t.private || 'Private'}</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <TbParking className="inline mr-2 ml-2 text-blue-600" />
                {t.privateParking} *
              </label>
              <select
                name="privateParking"
                value={formData.privateParking}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="no">{t.no}</option>
                <option value="yes">{t.yes}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <MdOutlineDescription className="text-blue-600 mr-3 ml-3" />
            {t.description || 'Description'} *
          </h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        {/* Location Section */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <FaMapMarkerAlt className="text-blue-600 mr-3 ml-3" />
            {t.locationDetails || 'Location Details'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.governorate} *
              </label>
              <select
                name="governorate"
                value={formData.governorate}
                onChange={(e) => setFormData({
                  ...formData,
                  governorate: e.target.value,
                  city: '',
                  district: ''
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{t.selectGovernorate}</option>
                {locationsData.governorates.map(gov => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.city} *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({
                  ...formData,
                  city: e.target.value,
                  district: ''
                })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.governorate}
              >
                <option value="">{t.selectCity}</option>
                {availableCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.district} *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.city}
              >
                <option value="">{t.selectDistrict}</option>
                {availableDistricts.map(district => (
                  <option key={district.id} value={district.id}>
                    {district.name[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {t.location || 'Exact Address'} *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              {t.selectLocation || 'Select Exact Location on Map'} *
            </label>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
              <LocationPickerMap
                onLocationSelected={handleLocationSelect}
                initialPosition={{ lat: formData.latitude, lng: formData.longitude }}
              />
            </div>
            <div className="mt-3 text-gray-600 flex items-center">
              <FaMapMarkerAlt className="mr-2 ml-2 text-blue-500" />
              {t.coordinates || 'Coordinates'}: 
              {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <FaImages className="text-blue-600 mr-3 ml-3" />
            {t.media || 'Media'}
          </h2>

          <div className="mb-8">
            <label className="block text-gray-700 mb-3 font-medium">
              {t.propertyImages || 'Property Images'} *
              <span className="text-sm text-gray-500 ml-2">
                ({t.max10Images || 'Max 10 images'})
              </span>
            </label>

            <button
              type="button"
              onClick={openCloudinaryWidget}
              className="bg-[#375171] text-white py-3 px-6 rounded-lg mb-4 hover:bg-[#2d4360] transition-colors flex items-center cursor-pointer"
            >
              <FaImages className="mr-2 ml-2" />
              {t.uploadImages || 'Upload Images'}
            </button>

            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {formData.images.map((url, index) => (
                  <div key={`image-${index}`} className="relative group border rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-1 text-xs">
                      {t.image || 'Image'} {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center border border-dashed border-gray-300">
                <p className="text-gray-500">
                  {t.noImages || 'No images uploaded yet'}
                </p>
              </div>
            )}
          </div>

          {/* Video Section */}
          <div>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                name="includeVideo"
                checked={formData.includeVideo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  includeVideo: e.target.checked
                }))}
                className="mr-2 h-5 w-5 text-blue-600 rounded"
              />
              <span className="font-medium">
                {t.includeVideo || 'Include Video'} - 
                <span className="text-amber-600 font-bold ml-1">
                  10 {t.coins || 'coins'}
                </span>
                {session?.user?.coins >= 10 ? (
                  <span className="text-green-600 ml-2">
                    ({session.user.coins} {t.coinsAvailable || 'coins available'})
                  </span>
                ) : (
                  <span className="text-red-600 ml-2">
                    ({t.insufficientCoins || 'Insufficient coins'})
                  </span>
                )}
              </span>
            </label>

            {formData.includeVideo && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => document.getElementById('videoUpload').click()}
                    className="bg-[#375171] text-white py-3 px-6 rounded-lg hover:bg-[#2d4360] transition-colors flex items-center cursor-pointer"
                  >
                    <IoIosVideocam className="mr-2 ml-2 text-lg" />
                    {t.uploadVideo || 'Upload Video'}
                  </button>
                  <input
                    id="videoUpload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {formData.video && (
                    <span className="text-green-600 flex items-center">
                      <FaCheck className="mr-1" /> {t.videoUploaded || 'Video uploaded'}
                    </span>
                  )}
                </div>
                
                {formData.video && (
                  <div className="mt-4">
                    <video
                      src={formData.video}
                      controls
                      className="max-w-full max-h-64 rounded-lg"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || formData.images.length === 0}
            className="bg-[#375171] text-white py-3 px-8 rounded-lg hover:bg-[#2d4360] disabled:bg-gray-400 w-full md:w-auto text-lg font-medium transition-colors cursor-pointer"
          >
            {isSubmitting 
              ? (t.updating || 'Updating...') 
              : (t.updateProperty || 'Update Property')}
          </button>
        </div>
      </form>
      
      {/* Cloudinary script */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async />
    </div>
  );
}