'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { CiUser } from "react-icons/ci";

export default function ProfileSettings() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
  });
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
    
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        mobile: session.user.email || '',
      });
      setProfileImage(session.user.image || '');
      setLoading(false);
    }
  }, [status, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setImageError(t.imageTooLarge || 'Image too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    setImageError('');
    setImageSuccess(false);
    
    try {
      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
      
      // Update with secure URL
      const secureUrl = data.secure_url;
      setProfileImage(secureUrl);
      
      // Save to database
      const updateResponse = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          image: secureUrl
        })
      });
      
      const updateData = await updateResponse.json();
      
      if (updateResponse.ok) {
        // Update session using NextAuth's update method
        await update({
          user: {
            ...session.user,
            image: secureUrl
          }
        });
     
        await fetch('/api/auth/session?update=1', { method: 'GET' });

        const newSession = await update();
        setProfileImage(newSession?.user?.image || '');
        
        setImageSuccess(true);
        setTimeout(() => setImageSuccess(false), 3000);
      } else {
        throw new Error(updateData.message || 'Failed to save image');
      }
    } catch (err) {
      setImageError(t.uploadError || 'Image upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
          image: profileImage
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update session using NextAuth's update method
        await update({
          user: {
            ...session.user,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.mobile,
            image: profileImage,
            firstName: formData.firstName,
            lastName: formData.lastName
          }
        });
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || t.updateError || 'Update failed');
      }
    } catch (err) {
      setError(t.networkError || 'Network error');
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-[#375171] mb-6">
        {t.profileSettings || 'Profile Settings'}
      </h2>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {t.profileUpdated || 'Profile updated successfully!'}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Profile Image */}
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full object-cover border-4 border-[#375171]"
                />
              ) : (
                <div className="bg-gray-200 border-2 rounded-full w-48 h-48 flex items-center justify-center">
                  <CiUser className="text-6xl text-gray-500" />
                </div>
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white">Uploading...</div>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="bg-[#375171] text-white px-4 py-2 rounded-lg hover:bg-[#2d4360] disabled:bg-gray-400"
            >
              {t.changeImage || 'Change Image'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {t.imageFormats || 'JPG, PNG up to 5MB'}
            </p>
            
            {imageError && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                {imageError}
              </div>
            )}
            
            {imageSuccess && (
              <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                {t.imageUpdated || 'Profile image updated successfully!'}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {t.firstName || 'First Name'}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {t.lastName || 'Last Name'}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {t.mobileNumber || 'Mobile Number'}
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#375171] text-white py-3 px-4 rounded-md hover:bg-[#2d4360] transition mt-4"
          >
            {t.updateProfile || 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}