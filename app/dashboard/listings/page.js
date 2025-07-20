'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from 'next/link';
import { CiCirclePlus } from "react-icons/ci";
import PropertyCard from '@/components/PropertyCard';

export default function ListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
      return;
    }
    
    if (status === "authenticated") {
      fetchListings();
    }
  }, [status, router]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?myListings=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      setLoading(false);
    }
  };
  
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }
  const handleCardClick = (property) => {
    // Navigate to property detail page
    router.push(`/properties/${property._id}`);
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#375171]">
          {t.yourListings || 'Your Listings'}
        </h1>
        <Link 
          href="/dashboard/listings/new" 
          className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center hover:bg-green-700 transition-colors"
        >
          <CiCirclePlus className="mr-2 text-xl" />
          <span>{t.addProperty || 'Add Property'}</span>
        </Link>
      </div>
      
      <p className="text-gray-600 mb-8">
        {t.listingsDesc || 'Manage your property listings'}
      </p>
      
      {listings.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {t.noListings || 'You have no property listings yet'}
          </p>
          <Link 
            href="/dashboard/listings/new" 
            className="bg-[#375171] text-white px-4 py-2 rounded-lg inline-block hover:bg-[#2d4360] transition-colors"
          >
            {t.addFirstProperty || 'Add your first property'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((property) => (
            <PropertyCard 
              key={property._id} 
              property={property} 
              basePath="/dashboard/listings"
              showEdit={true}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}