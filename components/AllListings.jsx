// /Users/jafar/Desktop/beti/components/AllListings.jsx
'use client';
import { useState, useEffect } from 'react';
import PublicPropertyCard from './PublicPropertyCard';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from "next-auth/react";
import { FaFilter, FaDollarSign, FaBed, FaBuilding, FaCheckCircle, FaSync } from "react-icons/fa";

export default function AllListings({ properties }) {
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    verifiedOnly: false
  });

  const { language, translations } = useLanguage();
  const { data: session } = useSession();
  const t = translations[language] || {};

 

  // Apply filters when filters change
  useEffect(() => {
    let result = [...properties];

    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms >= Number(filters.bedrooms));
    }

    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.verifiedOnly) {
      result = result.filter(p => p.isVerified);
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: '',
      verifiedOnly: false
    });
  };


  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#375171] ">
          {t.allListings || 'All Listings'}
        </h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {filteredProperties.length} {t.properties || 'Properties'}
        </span>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaFilter className="text-blue-600 mr-3" />
            {t.filterListings || 'Filter Listings'}
          </h2>
          <button
            onClick={resetFilters}
            className="flex items-center text-[#375171] hover:text-[#2d4360] font-medium cursor-pointer"
          >
            <FaSync className="mr-2" />
            {t.resetFilters || 'Reset Filters'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label className=" text-gray-700 mb-2 font-medium flex items-center">
              <FaDollarSign className="mr-2 text-blue-600" />
              {t.minPrice || 'Min Price'}
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t.minPricePlaceholder || 'Min'}
            />
          </div>
          
          <div>
            <label className=" text-gray-700 mb-2 font-medium flex items-center">
              <FaDollarSign className="mr-2 text-blue-600" />
              {t.maxPrice || 'Max Price'}
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t.maxPricePlaceholder || 'Max'}
            />
          </div>
          
          <div>
            <label className=" text-gray-700 mb-2 font-medium flex items-center">
              <FaBed className="mr-2 text-blue-600" />
              {t.bedrooms || 'Bedrooms'}
            </label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{t.any || 'Any'}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          
          <div>
            <label className=" text-gray-700 mb-2 font-medium flex items-center">
              <FaBuilding className="mr-2 text-blue-600" />
              {t.propertyType || 'Property Type'}
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          
          <div className="flex items-end">
            <label className="flex items-center h-full p-3 bg-gray-50 rounded-lg w-full">
              <input
                type="checkbox"
                name="verifiedOnly"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  verifiedOnly: e.target.checked
                }))}
                className="h-5 w-5 text-[#375171] mr-3"
              />
              <span className="text-gray-700 font-medium flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" />
                {t.verifiedOnly || 'Verified Only'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      {filteredProperties.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PublicPropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}