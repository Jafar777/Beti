'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const FeaturedListings = () => {
  const { language, translations } = useLanguage();
  const t = translations[language] || {};

  // Mock data for featured listings
  const featuredProperties = [
    {
      id: 1,
      title: "Modern Apartment in Damascus",
      price: "150,000 USD",
      location: "Damascus, Syria",
      bedrooms: 3,
      bathrooms: 2,
      area: "150 m²",
      image: "/property1.jpg"
    },
    {
      id: 2,
      title: "Luxury Villa in Latakia",
      price: "350,000 USD",
      location: "Latakia, Syria",
      bedrooms: 5,
      bathrooms: 4,
      area: "300 m²",
      image: "/property2.jpg"
    },
    {
      id: 3,
      title: "Downtown Office Space",
      price: "200,000 USD",
      location: "Aleppo, Syria",
      bedrooms: "-",
      bathrooms: 2,
      area: "200 m²",
      image: "/property3.jpg"
    },
    {
      id: 4,
      title: "Seaside Apartment",
      price: "180,000 USD",
      location: "Tartus, Syria",
      bedrooms: 2,
      bathrooms: 2,
      area: "120 m²",
      image: "/property4.jpg"
    },
  ];

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-[#375171] mb-6 text-center">
        {t.featuredListings || 'Featured Listings'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 border-b">
              {property.image ? (
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
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
        <Link 
          href="/properties" 
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
        >
          {t.viewAllProperties || 'View All Properties'}
        </Link>
      </div>
    </div>
  );
};

export default FeaturedListings;