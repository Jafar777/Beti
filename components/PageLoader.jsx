// components/PageLoader.jsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Halflogo from '../assets/half.svg'
export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#375171] flex items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        
        {/* Logo text */}
        <div className="absolute inset-4 flex items-center justify-center">
           <Image src={Halflogo} alt='HelfLogo'></Image>
        </div>
      </div>
    </div>
  );
}