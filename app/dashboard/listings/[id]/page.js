'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LocationPickerMap from '@/components/LocationPickerMap';
import { CldUploadWidget } from 'next-cloudinary';
import { FaTrash } from "react-icons/fa";

export default function EditListingPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    latitude: 33.510414,
    longitude: 36.278336,
    images: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        setError(t.networkError || 'Failed to load property');
        setLoading(false);
      }
    };
    
    if (session && id) {
      fetchProperty();
    }
  }, [session, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationSelect = (position) => {
    setFormData(prev => ({
      ...prev,
      latitude: position.lat,
      longitude: position.lng
    }));
  };
  
  const handleImageUpload = (result) => {
    if (result.event === 'success') {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.info.secure_url]
      }));
    }
  };
  
  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }
      
      router.push('/dashboard/listings');
    } catch (err) {
      setError(err.message || t.networkError || 'Failed to update listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.editProperty || 'Edit Property'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow-md p-6">
        {/* ... (same form fields as NewListingPage) ... */}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#375171] text-white py-3 px-6 rounded-md hover:bg-[#2d4360] disabled:bg-gray-400 w-full md:w-auto"
        >
          {isSubmitting ? (t.updating || 'Updating...') : (t.updateProperty || 'Update Property')}
        </button>
      </form>
    </div>
  );
}