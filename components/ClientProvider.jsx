'use client'
import { SessionProvider, useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <ClientContent>
        {children}
      </ClientContent>
    </SessionProvider>
  );
}

function ClientContent({ children }) {
  const { data: session } = useSession();
  const { language } = useLanguage();
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar session={session} />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}