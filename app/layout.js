// app/layout.js
import './globals.css';
import ClientProviders from './ClientProviders';
import PageLoader from '@/components/PageLoader';
import LoadingOverlay from '@/components/LoadingOverlay';
import { PropertiesProvider } from '@/context/PropertiesContext';

export const metadata = {
  title: 'Beti | بيتي',
  description: 'منصة العقارات الأفضل في سوريا',
  icon: '/favicon.ico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <PropertiesProvider> {/* Add this */}

          <PageLoader />
          <LoadingOverlay />
          {children}
 </PropertiesProvider> 
        </ClientProviders>
      </body>
    </html>
  );
}