'use client';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/context/LanguageContext';
import ClientProvider from '@/components/ClientProvider';

export default function ClientProviders({ children }) {
  return (
    <LanguageProvider>
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </SessionProvider>
    </LanguageProvider>
  );
}