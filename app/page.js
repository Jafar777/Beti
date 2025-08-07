// app/page.js
'use client';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import GoogleMapComponent from "@/components/GoogleMap";
import FeaturedListings from "@/components/FeaturedListings";
import AllListings from "@/components/AllListings";
import { useState, useEffect } from 'react';
import { useProperties } from '@/context/PropertiesContext'; // Add this


export default function Home() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(true);
    const { properties, loading } = useProperties(); // Get properties from context


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-[#375171] text-3xl font-bold mb-6 text-center">{t.map}</h1>
      
      {/* Google Map Component */}
      <div className="mb-8">
        <GoogleMapComponent properties={properties} />
      </div>
      
      {/* Featured Listings Section */}
      <FeaturedListings  properties={properties}  />
      
      {/* All Listings Section */}
      <div>
        <h1 className="text-[#375171] text-3xl font-bold mb-6 text-center">{t.list}</h1>
        <AllListings  properties={properties}  />
      </div>
    </div>
  );
}