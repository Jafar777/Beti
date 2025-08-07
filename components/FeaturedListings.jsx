'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

const FeaturedListings = ({properties}) => {
  const { language, translations } = useLanguage();
  const t = translations[language] || {};



  // Filter featured properties
  const featuredProperties = properties
    .filter(property => property.isFeatured)
    .slice(0, 4);




 if (featuredProperties.length === 0) {
    return (
      <div className="my-12 text-center">
        <p>{t.noFeaturedListings || 'No featured listings available'}</p>
      </div>
    );
  }


  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-[#375171] mb-6 text-center">
        {t.featuredListings || 'Featured Listings'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProperties.map(property => (
          <div 
            key={property._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-yellow-600 relative"
          >
            {/* Golden Featured Badge */}
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
              <FaStar className="mr-1" />
              {t.featured || 'Featured'}
            </div>
            
            <div className="h-48 bg-gray-200 border-b">
              {property.images?.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">{t.noImage || 'No Image'}</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-[#375171]">{property.title}</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-yellow-700">${property.price?.toLocaleString()}</span>
                <span className="text-sm text-gray-500">{property.location}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-700 mt-4">
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
                  <span className="font-medium">{property.area} m²</span>
                </div>
              </div>
              
              <Link 
                href={`/properties/${property._id}`}
                className="block mt-4 w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-center py-2 rounded hover:from-yellow-700 hover:to-yellow-800 transition-all"
              >
                {t.viewDetails || 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedListings;