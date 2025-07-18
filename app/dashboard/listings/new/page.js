'use client';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function NewListingPage() {
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // In real app, you would post to your API
      // const response = await fetch('/api/listings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     userId: session.user.id
      //   })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to listings page after success
      router.push('/dashboard/listings');
    } catch (err) {
      setError(t.networkError || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.addProperty || 'Add New Property'}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              {t.title || 'Property Title'} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.price || 'Price'} *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.location || 'Location'} *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.propertyType || 'Property Type'} *
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="apartment">{t.apartment || 'Apartment'}</option>
              <option value="villa">{t.villa || 'Villa'}</option>
              <option value="office">{t.office || 'Office'}</option>
              <option value="land">{t.land || 'Land'}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.bedrooms || 'Bedrooms'} *
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              {t.bathrooms || 'Bathrooms'} *
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t.description || 'Description'} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-md"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t.area || 'Area (m²)'} *
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#375171] text-white py-3 px-6 rounded-md hover:bg-[#2d4360] disabled:bg-gray-400"
        >
          {isSubmitting ? (t.processing || 'Processing...') : (t.addProperty || 'Add Property')}
        </button>
      </form>
    </div>
  );
}