'use client'
import { SessionProvider, useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function ClientProvider({ children }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {/* Add LanguageProvider here */}

        <ClientContent>
          {children}
        </ClientContent>

    </SessionProvider>
  );
}

function ClientContent({ children }) {
  const { data: session } = useSession();
  const { language } = useLanguage(); // Now this is within LanguageProvider
  const [refreshKey, setRefreshKey] = useState(0);
  
  const refreshSession = () => {
    setRefreshKey(Date.now());
  };
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar session={session} refreshSession={refreshSession} />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}