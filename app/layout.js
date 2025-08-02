// app/layout.js
import './globals.css';
import ClientProviders from './ClientProviders';
import PageLoader from '@/components/PageLoader';
import LoadingOverlay from '@/components/LoadingOverlay';

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

          <PageLoader />
          <LoadingOverlay />
          {children}

        </ClientProviders>
      </body>
    </html>
  );
}