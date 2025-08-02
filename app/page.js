// app/page.js
'use client';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import GoogleMapComponent from "@/components/GoogleMap";
import FeaturedListings from "@/components/FeaturedListings";
import AllListings from "@/components/AllListings";
import { useState, useEffect } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-[#375171] text-3xl font-bold mb-6 text-center">{t.map}</h1>
      
      {/* Google Map Component */}
      <div className="mb-8">
        <GoogleMapComponent properties={properties} />
      </div>
      
      {/* Featured Listings Section */}
      <FeaturedListings />
      
      {/* All Listings Section */}
      <div>
        <h1 className="text-[#375171] text-3xl font-bold mb-6 text-center">{t.list}</h1>
        <AllListings />
      </div>
    </div>
  );
}