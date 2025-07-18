'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from 'next/link';
import { CiCirclePlus } from "react-icons/ci";

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
    }
    
    // Fetch user's listings (mock data for example)
    const fetchListings = async () => {
      try {
        // In real app, you would fetch from your API
        // const response = await fetch(`/api/listings?userId=${session.user.id}`);
        // const data = await response.json();
        
        // Mock data
        const mockListings = [
          { id: 1, title: "Modern Apartment in Damascus", status: "active", price: "$150,000" },
          { id: 2, title: "Villa in Latakia", status: "pending", price: "$350,000" },
          { id: 3, title: "Office Space in Aleppo", status: "draft", price: "$200,000" },
        ];
        
        setListings(mockListings);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setLoading(false);
      }
    };
    
    if (session) {
      fetchListings();
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#375171]">
          {t.yourListings || 'Your Listings'}
        </h1>
        <Link 
          href="/dashboard/listings/new" 
          className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center"
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
            className="bg-[#375171] text-white px-4 py-2 rounded-lg inline-block"
          >
            {t.addFirstProperty || 'Add your first property'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="mb-4">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  listing.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : listing.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.status}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
              <p className="text-lg font-semibold text-[#375171] mb-4">{listing.price}</p>
              <div className="flex space-x-2">
                <Link 
                  href={`/dashboard/listings/${listing.id}`}
                  className="text-[#375171] border border-[#375171] px-3 py-1 rounded hover:bg-[#375171] hover:text-white"
                >
                  {t.edit || 'Edit'}
                </Link>
                <button className="text-gray-500 hover:text-red-500">
                  {t.delete || 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}