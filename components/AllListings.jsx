'use client';
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const AllListings = () => {
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Mock data for all listings
  const allProperties = [
    {
      id: 1,
      title: "Modern Apartment in Damascus",
      price: "150,000 USD",
      location: "Damascus, Syria",
      type: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: "150 m²",
      featured: true
    },
    {
      id: 2,
      title: "Luxury Villa in Latakia",
      price: "350,000 USD",
      location: "Latakia, Syria",
      type: "villa",
      bedrooms: 5,
      bathrooms: 4,
      area: "300 m²",
      featured: true
    },
    {
      id: 3,
      title: "Downtown Office Space",
      price: "200,000 USD",
      location: "Aleppo, Syria",
      type: "commercial",
      bedrooms: "-",
      bathrooms: 2,
      area: "200 m²",
      featured: false
    },
    {
      id: 4,
      title: "Seaside Apartment",
      price: "180,000 USD",
      location: "Tartus, Syria",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: "120 m²",
      featured: true
    },
    {
      id: 5,
      title: "Farm Land for Sale",
      price: "120,000 USD",
      location: "Homs, Syria",
      type: "land",
      bedrooms: "-",
      bathrooms: "-",
      area: "500 m²",
      featured: false
    },
    {
      id: 6,
      title: "Modern Studio Apartment",
      price: "90,000 USD",
      location: "Damascus, Syria",
      type: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: "80 m²",
      featured: false
    },
    {
      id: 7,
      title: "Commercial Building",
      price: "500,000 USD",
      location: "Aleppo, Syria",
      type: "commercial",
      bedrooms: "-",
      bathrooms: 4,
      area: "600 m²",
      featured: false
    },
    {
      id: 8,
      title: "Family Villa with Garden",
      price: "280,000 USD",
      location: "Latakia, Syria",
      type: "villa",
      bedrooms: 4,
      bathrooms: 3,
      area: "250 m²",
      featured: true
    },
  ];

  // Filter properties based on active filter
  const filteredProperties = activeFilter === 'all' 
    ? allProperties 
    : allProperties.filter(property => property.type === activeFilter);

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-[#375171] mb-6 text-center">
        {t.allListings || 'All Listings'}
      </h2>
      
      {/* Property Type Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['all', 'apartment', 'villa', 'commercial', 'land'].map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === type
                ? 'bg-[#375171] text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {type === 'all' ? t.allProperties || 'All Properties' : 
             type === 'apartment' ? t.apartments || 'Apartments' :
             type === 'villa' ? t.villas || 'Villas' :
             type === 'commercial' ? t.commercial || 'Commercial' :
             t.land || 'Land'}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 border-b relative">
              {property.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold">
                  {t.featured || 'Featured'}
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">{t.propertyImage || 'Property Image'}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-[#375171]">{property.title}</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">{property.price}</span>
                <span className="text-sm text-gray-500">{property.location}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 mt-4">
                <div>
                  <span className="block">{t.bedrooms || 'Bedrooms'}</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div>
                  <span className="block">{t.bathrooms || 'Bathrooms'}</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div>
                  <span className="block">{t.area || 'Area'}</span>
                  <span className="font-medium">{property.area}</span>
                </div>
              </div>
              
              <Link 
                href={`/properties/${property.id}`}
                className="block mt-4 w-full bg-[#375171] text-white text-center py-2 rounded hover:bg-[#2d4360]"
              >
                {t.viewDetails || 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium">
          {t.loadMore || 'Load More'}
        </button>
      </div>
    </div>
  );
};

export default AllListings;