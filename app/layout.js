import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import ClientProvider from '@/components/ClientProvider';
import CustomSessionProvider from '@/components/SessionProvider';

export const metadata = {
  title: 'Beti | بيتي',
  description: 'منصة العقارات الأفضل في سوريا',
  icon: '/favicon.ico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CustomSessionProvider>
          <LanguageProvider>
            <ClientProvider>
              {children}
            </ClientProvider>
          </LanguageProvider>
        </CustomSessionProvider>
      </body>
    </html>
  );
}