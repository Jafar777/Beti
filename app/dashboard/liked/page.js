'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import PublicPropertyCard from '@/components/PublicPropertyCard'; // Use the public card component

export default function LikedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [likedProperties, setLikedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
    
    const fetchLikedProperties = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}/liked-properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch liked properties');
        }
        
        const data = await response.json();
        setLikedProperties(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch liked properties:", error);
        setLoading(false);
      }
    };
    
    if (session) {
      fetchLikedProperties();
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
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.liked || 'Liked Properties'}
      </h1>
      
      {likedProperties.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {t.noLikedProperties || 'You have not liked any properties yet'}
          </p>
          <Link 
            href="/properties" 
            className="bg-[#375171] text-white px-4 py-2 rounded-lg inline-block hover:bg-[#2d4360]"
          >
            {t.browseProperties || 'Browse Properties'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedProperties.map((property) => (
            <PublicPropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}