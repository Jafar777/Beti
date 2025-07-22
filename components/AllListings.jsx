'use client';
import { useState, useEffect } from 'react';
import PublicPropertyCard from './PublicPropertyCard';
import { useLanguage } from '@/context/LanguageContext';
import { useSession, signIn } from "next-auth/react";

export default function AllListings() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
        setFilteredProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

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
      result = result.filter(p => p.isVerified); // Assuming you have an isVerified field
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#375171] mb-6 text-center">
        {t.allListings || 'All Listings'}
      </h1>
      
      {session ? (
        <>
          {/* Filter Controls with improved styling */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#375171] mb-4">
              {t.filterListings || 'Filter Listings'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  {t.minPrice || 'Min Price'}
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                  placeholder={t.minPrice || 'Min Price'}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  {t.maxPrice || 'Max Price'}
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                  placeholder={t.maxPrice || 'Max Price'}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  {t.bedrooms || 'Bedrooms'}
                </label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
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
                <label className="block text-gray-700 mb-2 font-medium">
                  {t.propertyType || 'Property Type'}
                </label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                >
                  <option value="">{t.any || 'Any'}</option>
                  <option value="apartment">{t.apartment || 'Apartment'}</option>
                  <option value="villa">{t.villa || 'Villa'}</option>
                  <option value="office">{t.office || 'Office'}</option>
                  <option value="land">{t.land || 'Land'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center h-full">
                  <input
                    type="checkbox"
                    name="verifiedOnly"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      verifiedOnly: e.target.checked
                    }))}
                    className="mr-2 h-5 w-5 text-[#375171]"
                  />
                  <span className="text-gray-700 font-medium">
                    {t.verifiedOnly || 'Verified Only'}
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={resetFilters}
                className="bg-[#375171] hover:bg-[#2d4360] text-white px-6 py-2 rounded-md font-medium"
              >
                {t.resetFilters || 'Reset Filters'}
              </button>
            </div>
          </div>
          
          {/* Property Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.length === 0 ? (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500 text-xl">{t.noPropertiesFound || 'No properties found'}</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 bg-[#375171] text-white px-6 py-3 rounded-md hover:bg-[#2d4360] font-medium"
                >
                  {t.clearFilters || 'Clear Filters'}
                </button>
              </div>
            ) : (
              filteredProperties.map(property => (
                <PublicPropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </>
      ) : (
        // Login prompt for unauthenticated users
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto text-center">
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold text-[#375171] mb-4">
              {t.loginRequired || 'Login Required'}
            </h2>
            <p className="text-gray-600 mb-6">
              {t.loginToViewListings || 'Please log in to view all property listings'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => signIn()}
                className="bg-[#375171] text-white px-6 py-3 rounded-lg hover:bg-[#2d4360] font-medium"
              >
                {t.signIn || 'Sign In'}
              </button>
              <button
                onClick={() => signIn()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                {t.signUp || 'Sign Up'}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#375171] mb-4">
              {t.verifiedSample || 'Verified Property Sample'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties
                .filter(p => p.isVerified) // Show verified properties
                .slice(0, 2)
                .map(property => (
                  <PublicPropertyCard key={property._id} property={property} />
                ))
              }
            </div>
            <p className="mt-6 text-gray-500 italic">
              {t.loginToSeeMore || 'Log in to see all available properties'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}