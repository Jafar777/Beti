'use client';
import { useState, useEffect } from 'react';
import PublicPropertyCard from './PublicPropertyCard';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from "next-auth/react";
import { 
  FaFilter, FaDollarSign, FaBed, FaBuilding, FaCheckCircle, 
  FaSync, FaHome, FaBath, FaRulerCombined, FaPlug, 
  FaWater, FaSnowflake, FaParking, FaGavel, FaCrown,
  FaCalendarAlt, FaPaintRoller, FaFileContract, FaKey
} from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { PiSolarRoofFill } from "react-icons/pi";
import { IoIosVideocam } from 'react-icons/io';

export default function AllListings({ properties }) {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    propertyType: '',
    propertyStatus: '',
    decorationType: '',
    contractType: '',
    ownershipType: '',
    airConditioning: '',
    electricity: '',
    water: '',
    rooftopOwnership: '',
    privateParking: '',
    violations: '',
    verifiedOnly: false,
    includeVideo: false
  });

  const { language, translations } = useLanguage();
  const { data: session } = useSession();
  const t = translations[language] || {};

  // Apply filters when filters change
  useEffect(() => {
    setLoadingFilters(true);
    let result = [...properties];
    
    try {
      // Basic filters
      if (filters.minPrice) {
        result = result.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        result = result.filter(p => p.price <= Number(filters.maxPrice));
      }
      if (filters.bedrooms) {
        result = result.filter(p => p.bedrooms >= Number(filters.bedrooms));
      }
      if (filters.bathrooms) {
        result = result.filter(p => p.bathrooms >= Number(filters.bathrooms));
      }
      if (filters.areaMin) {
        result = result.filter(p => p.area >= Number(filters.areaMin));
      }
      if (filters.areaMax) {
        result = result.filter(p => p.area <= Number(filters.areaMax));
      }
      if (filters.propertyType) {
        result = result.filter(p => p.propertyType === filters.propertyType);
      }
      
      // Advanced filters
      if (filters.propertyStatus) {
        result = result.filter(p => p.propertyStatus === filters.propertyStatus);
      }
      if (filters.decorationType) {
        result = result.filter(p => p.decorationType === filters.decorationType);
      }
      if (filters.contractType) {
        result = result.filter(p => p.contractType === filters.contractType);
      }
      if (filters.ownershipType) {
        result = result.filter(p => p.ownershipType === filters.ownershipType);
      }
      if (filters.airConditioning) {
        result = result.filter(p => p.airConditioning === filters.airConditioning);
      }
      if (filters.electricity) {
        result = result.filter(p => p.electricity === filters.electricity);
      }
      if (filters.water) {
        result = result.filter(p => p.water === filters.water);
      }
      if (filters.rooftopOwnership) {
        result = result.filter(p => p.rooftopOwnership === filters.rooftopOwnership);
      }
      if (filters.privateParking) {
        result = result.filter(p => p.privateParking === (filters.privateParking === 'yes'));
      }
      if (filters.violations) {
        result = result.filter(p => p.violations === (filters.violations === 'yes'));
      }
      if (filters.verifiedOnly) {
        result = result.filter(p => p.isVerified);
      }
      if (filters.includeVideo) {
        result = result.filter(p => p.video);
      }

      setFilteredProperties(result);
    } catch (error) {
      console.error("Filtering error:", error);
    } finally {
      setTimeout(() => setLoadingFilters(false), 300);
    }
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      areaMin: '',
      areaMax: '',
      propertyType: '',
      propertyStatus: '',
      decorationType: '',
      contractType: '',
      ownershipType: '',
      airConditioning: '',
      electricity: '',
      water: '',
      rooftopOwnership: '',
      privateParking: '',
      violations: '',
      verifiedOnly: false,
      includeVideo: false
    });
    setShowAdvancedFilters(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#375171]">
          {t.allListings || 'All Listings'}
        </h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm md:text-base">
            {filteredProperties.length} {t.properties || 'Properties'}
          </span>
          <button
            onClick={resetFilters}
            className="flex items-center text-[#375171] hover:text-[#2d4360] font-medium cursor-pointer text-sm md:text-base"
          >
            <FaSync className="mr-2 ml-2" />
            {t.resetFilters || 'Reset Filters'}
          </button>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaFilter className="text-blue-600 mr-3 ml-3" />
            {t.filterListings || 'Filter Listings'}
          </h2>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center text-[#375171] hover:text-[#2d4360] font-medium cursor-pointer px-4 py-2 border border-[#375171] rounded-lg"
          >
            {showAdvancedFilters 
              ? t.hideAdvancedFilters || 'Hide Advanced Filters' 
              : t.showAdvancedFilters || 'Show Advanced Filters'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center">
              <FaDollarSign className="mr-2 ml-2 text-blue-600" />
              {t.priceRange || 'Price Range'}
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder={t.minPricePlaceholder || 'Min'}
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t.maxPricePlaceholder || 'Max'}
              />
            </div>
          </div>
          
          {/* Bedrooms */}
          <div>
            <label className="text-gray-700 font-medium flex items-center">
              <FaBed className="mr-2 ml-2 text-blue-600" />
              {t.bedrooms || 'Bedrooms'}
            </label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t.any || 'Any'}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          
          {/* Bathrooms */}
          <div>
            <label className="text-gray-700 font-medium flex items-center">
              <FaBath className="mr-2 ml-2 text-blue-600" />
              {t.bathrooms || 'Bathrooms'}
            </label>
            <select
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleFilterChange}
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t.any || 'Any'}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
          
          {/* Property Type */}
          <div>
            <label className="text-gray-700 font-medium flex items-center">
              <FaBuilding className="mr-2 ml-2 text-blue-600" />
              {t.propertyType || 'Property Type'}
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t.any || 'Any'}</option>
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
        </div>

        {/* Advanced Filters - Toggleable */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaCrown className="text-amber-500 mr-2 ml-2" />
              {t.advancedFilters || 'Advanced Filters'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Area Range */}
              <div className="space-y-2">
                <label className="text-gray-700 font-medium flex items-center">
                  <FaRulerCombined className="mr-2 ml-2 text-blue-600" />
                  {t.areaRange || 'Area Range (m²)'}
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="areaMin"
                    value={filters.areaMin}
                    onChange={handleFilterChange}
                    className="w-full text-black px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.minArea || 'Min'}
                  />
                  <input
                    type="number"
                    name="areaMax"
                    value={filters.areaMax}
                    onChange={handleFilterChange}
                    className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.maxArea || 'Max'}
                  />
                </div>
              </div>
              
              {/* Property Status */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaHome className="mr-2 ml-2 text-blue-600" />
                  {t.propertyStatus || 'Property Status'}
                </label>
                <select
                  name="propertyStatus"
                  value={filters.propertyStatus}
                  onChange={handleFilterChange}
                  className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="demolished">{t.demolished || 'Demolished'}</option>
                  <option value="unbuilt">{t.unbuilt || 'Unbuilt'}</option>
                  <option value="intact">{t.intact || 'Intact'}</option>
                </select>
              </div>
              
              {/* Decoration Type */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaPaintRoller className="mr-2 ml-2 text-blue-600" />
                  {t.decorationType || 'Decoration Type'}
                </label>
                <select
                  name="decorationType"
                  value={filters.decorationType}
                  onChange={handleFilterChange}
                  className="w-full px-4 text-black py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="bare_bones">{t.bare_bones || 'Bare Bones'}</option>
                  <option value="old_coating">{t.old_coating || 'Old Coating'}</option>
                  <option value="normal_coating">{t.normal_coating || 'Normal Coating'}</option>
                  <option value="deluxe_coating">{t.deluxe_coating || 'Deluxe Coating'}</option>
                  <option value="super_deluxe_coating">{t.super_deluxe_coating || 'Super Deluxe'}</option>
                </select>
              </div>
              
              {/* Contract Type */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaFileContract className="mr-2 ml-2 text-blue-600" />
                  {t.contractType || 'Contract Type'}
                </label>
                <select
                  name="contractType"
                  value={filters.contractType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="rent">{t.rent || 'Rent'}</option>
                  <option value="sale">{t.sale || 'Sale'}</option>
                  <option value="mortgage">{t.mortgage || 'Mortgage'}</option>
                </select>
              </div>
              
              {/* Ownership Type */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaKey className="mr-2 ml-2 text-blue-600" />
                  {t.ownershipType || 'Ownership Type'}
                </label>
                <select
                  name="ownershipType"
                  value={filters.ownershipType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="green_deed">{t.green_deed || 'Green Deed'}</option>
                  <option value="white_deed">{t.white_deed || 'White Deed'}</option>
                  <option value="court_decision">{t.court_decision || 'Court Decision'}</option>
                  <option value="notary">{t.notary || 'Notary'}</option>
                  <option value="emiri">{t.emiri || 'Emiri'}</option>
                  <option value="reform">{t.reform || 'Reform'}</option>
                  <option value="charitable_endowment">{t.charitable_endowment || 'Charitable Endowment'}</option>
                  <option value="lineage_endowment">{t.lineage_endowment || 'Lineage Endowment'}</option>
                </select>
              </div>
              
              {/* Air Conditioning */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <TbAirConditioning className="mr-2 ml-2 text-blue-600 text-lg" />
                  {t.airConditioning || 'Air Conditioning'}
                </label>
                <select
                  name="airConditioning"
                  value={filters.airConditioning}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
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
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaPlug className="mr-2 ml-2 text-blue-600" />
                  {t.electricity || 'Electricity'}
                </label>
                <select
                  name="electricity"
                  value={filters.electricity}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="no_electricity">{t.noElectricity || 'No Electricity'}</option>
                  <option value="solar_panels">{t.solarPanels || 'Solar Panels'}</option>
                  <option value="amber_subscription">{t.amberSubscription || 'Amber Subscription'}</option>
                  <option value="only_government_electricity">
                    {t.govElectricity || 'Government Electricity'}
                  </option>
                </select>
              </div>
              
              {/* Water */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaWater className="mr-2 ml-2 text-blue-600" />
                  {t.water || 'Water'}
                </label>
                <select
                  name="water"
                  value={filters.water}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="no_water">{t.noWater || 'No Water'}</option>
                  <option value="non_drinkable">{t.nonDrinkable || 'Non-Drinkable'}</option>
                  <option value="drinkable">{t.drinkable || 'Drinkable'}</option>
                </select>
              </div>
              
              {/* Rooftop Ownership */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <PiSolarRoofFill className="mr-2 ml-2 text-blue-600" />
                  {t.rooftopOwnership || 'Rooftop Ownership'}
                </label>
                <select
                  name="rooftopOwnership"
                  value={filters.rooftopOwnership}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="shared">{t.shared || 'Shared'}</option>
                  <option value="private">{t.private || 'Private'}</option>
                </select>
              </div>
              
              {/* Private Parking */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaParking className="mr-2 ml-2 text-blue-600" />
                  {t.privateParking || 'Private Parking'}
                </label>
                <select
                  name="privateParking"
                  value={filters.privateParking}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="yes">{t.yes || 'Yes'}</option>
                  <option value="no">{t.no || 'No'}</option>
                </select>
              </div>
              
              {/* Violations */}
              <div>
                <label className="text-gray-700 font-medium flex items-center">
                  <FaGavel className="mr-2 ml-2 text-blue-600" />
                  {t.violations || 'Violations'}
                </label>
                <select
                  name="violations"
                  value={filters.violations}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="yes">{t.yes || 'Yes'}</option>
                  <option value="no">{t.no || 'No'}</option>
                </select>
              </div>
            </div>
            
            {/* Checkbox Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <label className="flex items-center p-3 bg-gray-50 rounded-lg text-black">
                <input
                  type="checkbox"
                  name="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={handleFilterChange}
                  className="h-5 w-5 text-[#375171] mr-3"
                />
                <span className="text-gray-700 font-medium flex items-center">
                  <FaCheckCircle className="mr-2 ml-2 text-green-500" />
                  {t.verifiedOnly || 'Verified Only'}
                </span>
              </label>
              
              <label className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  name="includeVideo"
                  checked={filters.includeVideo}
                  onChange={handleFilterChange}
                  className="h-5 w-5 text-[#375171] mr-3"
                />
                <span className="text-gray-700 font-medium flex items-center">
                  <IoIosVideocam className="mr-2 ml-2 text-blue-500" />
                  {t.includeVideo || 'Has Video'}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loadingFilters && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Property Listings */}
      {!loadingFilters && filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-5xl text-gray-300 mb-4">🏠</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {t.noPropertiesFound || 'No properties found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {t.noPropertiesDescription || 'Try adjusting your filters to find more properties'}
          </p>
          <button
            onClick={resetFilters}
            className="bg-[#375171] text-white px-6 py-3 rounded-lg hover:bg-[#2d4360] font-medium cursor-pointer"
          >
            {t.clearFilters || 'Clear Filters'}
          </button>
        </div>
      ) : (
        !loadingFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PublicPropertyCard key={property._id} property={property} />
            ))}
          </div>
        )
      )}
    </div>
  );
}