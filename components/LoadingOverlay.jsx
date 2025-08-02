// components/LoadingOverlay.jsx
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Halflogo from '../assets/half.svg'
export default function LoadingOverlay() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);
    
    // Add event listeners
    window.addEventListener('routechangestart', handleRouteChangeStart);
    
    // Automatically hide when route changes
    const handleRouteChange = () => setLoading(false);
    window.addEventListener('routechangecomplete', handleRouteChange);
    
    return () => {
      window.removeEventListener('routechangestart', handleRouteChangeStart);
      window.removeEventListener('routechangecomplete', handleRouteChange);
    };
  }, []);

  // Reset loading state when path changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#375171] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Image src={Halflogo} alt='HelfLogo'></Image>
        </div>
      </div>
    </div>
  );
}