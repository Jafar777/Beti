'use client';
import { useState, useRef,useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LocationPickerMap from '@/components/LocationPickerMap';
import { FaTrash } from "react-icons/fa";
import { syriaLocations as staticLocations, getGovernorate, getCity } from '@/data/syriaLocations';


export default function NewListingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
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
  privateParking: false,
  entrances: 1,
  electricity: 'only_government_electricity',
  water: 'non_drinkable',
  violations: false,
  rooftopOwnership: 'shared',
  video: '',

    
  });
   const [locationsData, setLocationsData] = useState({ governorates: [] });
  const [loadingLocations, setLoadingLocations] = useState(true);
   const availableCities = formData.governorate 
    ? getGovernorate(formData.governorate)?.cities || []
    : [];
    
  // Get available districts based on selected city
  const availableDistricts = formData.city 
    ? getCity(formData.city)?.districts || []
    : [];

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
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
    
    fetchLocations();
  }, []);
  const handleLocationSelect = (position) => {
    setFormData(prev => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng,
      pinLocation: position 
    }));
  };
  
  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    

    try {
      // Create the property data object
     const propertyData = {
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      entrances: Number(formData.entrances),
      pinLocation: formData.pinLocation,
      governorate: formData.governorate,
      city: formData.city,
      district: formData.district,
      
 
      rooftopOwnership: String(formData.rooftopOwnership) ,
      
      // Convert these directly to booleans
      privateParking: Boolean(formData.privateParking),
      violations: Boolean(formData.violations)
    };

  if (!formData.governorate || !formData.city || !formData.district) {
    setError(t.locationRequired || 'Please select governorate, city, and district');


    // Add this function to handle video uploads

    return;
  }
        console.log("🔶 propertyData going out:", propertyData);  // Send to API
      // Send to API with credentials
      const response = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Pass the session token explicitly
          Authorization: `Bearer ${session.accessToken}`
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(propertyData)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create listing');
      }
      
      // Redirect to listings page after success
      router.push('/dashboard/listings');
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || t.networkError || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCloudinaryWidget = () => {
    // Initialize Cloudinary widget
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
        maxImageFileSize: 5000000, // 5MB
        cropping: true,
        croppingAspectRatio: 16/9,
        showSkipCropButton: false
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log("Cloudinary result:", result);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, result.info.secure_url]
          }));
        } else if (error) {
          console.error("Cloudinary error:", error);
        }
      }
    );
    
    widgetRef.current.open();
  };
   if (loadingLocations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading locations...</div>
      </div>
    );
  }
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
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    setFormData(prev => ({ ...prev, video: data.secure_url }));
  } catch (error) {
    console.error('Video upload error:', error);
    setError(t.videoUploadError || 'Failed to upload video');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.addProperty || 'Add New Property'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              {t.title || 'Property Title'} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

            <div>
    <label className="block text-gray-700 mb-2">
      {t.contractType} *
    </label>
    <select
      name="contractType"
      value={formData.contractType}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md"
      required
    >
      <option value="rent">{t.rent}</option>
      <option value="sale">{t.sale}</option>
      <option value="mortgage">{t.mortgage}</option>
    </select>
  </div>
  
  {/* Ownership Type */}
  <div>
    <label className="block text-gray-700 mb-2">
      {t.ownershipType} *
    </label>
    <select
      name="ownershipType"
      value={formData.ownershipType}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md"
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
            <label className="block text-gray-700 mb-2">
              {t.price || 'Price'} (USD) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
              min="1"
            />
          </div>


          
  
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.propertyType || 'Property Type'} *
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
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
            <label className="block text-gray-700 mb-2">
              {t.bedrooms || 'Bedrooms'} *
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.bathrooms || 'Bathrooms'} *
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.area || 'Area (m²)'} *
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Property Age */}
  <div>
    <label className="block text-gray-700 mb-2">
      {t.propertyAge || 'Property Age'} *
    </label>
    <input
      type="text"
      name="age"
      value={formData.age}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-md"
      required
    />
  </div>
  
  {/* Entrances */}
  <div>
    <label className="block text-gray-700 mb-2">
      {t.entrances || 'Number of Entrances'} *
    </label>
    <input
      type="number"
      name="entrances"
      value={formData.entrances}
      onChange={handleChange}
      min="1"
      className="w-full px-3 py-2 border rounded-md"
      required
    />
  </div>
</div>

{/* Air Conditioning */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    {t.airConditioning || 'Air Conditioning'} *
  </label>
  <select
    name="airConditioning"
    value={formData.airConditioning}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
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

{/* Electricity */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    {t.electricity || 'Electricity'} *
  </label>
  <select
    name="electricity"
    value={formData.electricity}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
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

{/* Water */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    {t.water || 'Water'} *
  </label>
  <select
    name="water"
    value={formData.water}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
    required
  >
    <option value="no_water">{t.noWater || 'No Water'}</option>
    <option value="non_drinkable">{t.nonDrinkable || 'Non-Drinkable'}</option>
    <option value="drinkable">{t.drinkable || 'Drinkable'}</option>
  </select>
</div>

{/* Rooftop Ownership */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    {t.rooftopOwnership || 'Rooftop Ownership'} *
  </label>
  <select
    name="rooftopOwnership"
    value={formData.rooftopOwnership}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
    required
  >
    <option value="shared">{t.shared || 'Shared'}</option>
    <option value="private">{t.private || 'Private'}</option>
  </select>
</div>

{/* Checkboxes Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  {/* Private Parking */}
  <div className="flex items-center">
    <input
      type="checkbox"
      name="privateParking"
      checked={formData.privateParking}
      onChange={(e) => setFormData(prev => ({ ...prev, privateParking: e.target.checked }))}
      className="mr-2"
    />
    <label>{t.privateParking || 'Private Parking'}</label>
  </div>
  
  {/* Violations */}
  <div className="flex items-center">
    <input
      type="checkbox"
      name="violations"
      checked={formData.violations}
      onChange={(e) => setFormData(prev => ({ ...prev, violations: e.target.checked }))}
      className="mr-2"
    />
    <label>{t.violations || 'Violations Exist'}</label>
  </div>
</div>

{/* Video Upload - Only for golden/diamond */}
{(session?.user?.subscription?.plan === 'golden' || session?.user?.subscription?.plan === 'diamond') && (
  <div className="mb-6">
    <label className="block text-gray-700 mb-2">
      {t.video || 'Property Video'}
    </label>
    <input
      type="file"
      accept="video/*"
      onChange={handleVideoUpload}
      className="w-full px-3 py-2 border rounded-md"
    />
    {formData.video && (
      <div className="mt-2">
        <video 
          src={formData.video} 
          controls 
          className="max-w-full max-h-64"
        />
      </div>
    )}
  </div>
)}
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t.description || 'Description'} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-md"
            required
          ></textarea>
        </div>
                    <div className="">
    <h3 className="text-xl font-bold text-[#375171] mb-4">
      {t.locationDetails || 'Location Details'}
    </h3>
    
    {/* Governorate Selector */}
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
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
    className="w-full px-3 py-2 border rounded-md"
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
    
    {/* City Selector */}
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
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
        className="w-full px-3 py-2 border rounded-md"
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
    
    {/* District Selector */}
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        {t.district} *
      </label>
      <select
        name="district"
        value={formData.district}
        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
        className="w-full px-3 py-2 border rounded-md"
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
    {/* ADD THIS SECTION - Location Field */}
<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    {t.location || 'Exact Address'} *
  </label>
  <input
    type="text"
    name="location"
    value={formData.location}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-md"
    required
  />
</div>
  </div>

 
        
        {/* Location Picker */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t.selectLocation || 'Select Exact Location on Map'} *
            <span className="text-sm text-gray-500 ml-2">
              ({t.clickToPlace || 'Click on the map to place your property'})
            </span>
          </label>
          <LocationPickerMap 
            onLocationSelected={handleLocationSelect} 
            initialPosition={{ lat: formData.latitude, lng: formData.longitude }}
          />
          <div className="mt-2 text-sm text-gray-600">
            {t.coordinates || 'Coordinates'}: 
            {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </div>
          <input 
            type="hidden" 
            name="latitude" 
            value={formData.latitude} 
          />
          <input 
            type="hidden" 
            name="longitude" 
            value={formData.longitude} 
          />
        </div>
        
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t.propertyImages || 'Property Images'} *
            <span className="text-sm text-gray-500 ml-2">
              ({t.max10Images || 'Max 10 images'})
            </span>
          </label>
          
          <button
            type="button"
            onClick={openCloudinaryWidget}
            className="bg-[#375171] text-white py-2 px-4 rounded-md mb-4 hover:bg-[#2d4360]"
          >
            {t.uploadImages || 'Upload Images'}
          </button>
          
          {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {formData.images.map((url, index) => (
                <div key={`image-${index}`} className="relative group border rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Property ${index + 1}`} 
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 text-xs">
                    {t.image || 'Add Images for the property'} {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                {t.noImages || 'No images uploaded yet'}
              </p>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || formData.images.length === 0}
          className="bg-[#375171] text-white py-3 px-6 rounded-md hover:bg-[#2d4360] disabled:bg-gray-400 w-full md:w-auto"
        >
          {isSubmitting ? (t.processing || 'Processing...') : (t.addProperty || 'Add Property')}
        </button>
      </form>
      
      {/* Cloudinary script */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" async />
    </div>
  );
}