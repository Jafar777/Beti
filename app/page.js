'use client';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import GoogleMapComponent from "@/components/GoogleMap";
import FeaturedListings from "@/components/FeaturedListings";
import AllListings from "@/components/AllListings";

export default function Home() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-[#375171] text-3xl font-bold mb-6 text-center">{t.map}</h1>
      
      {/* Google Map Component */}
      <div className="mb-8">
        <GoogleMapComponent />
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