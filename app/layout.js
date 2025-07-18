import './globals.css';

import ClientProviders from './ClientProviders'; // Import the new wrapper

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
          
            {children}
         
        </ClientProviders>
      </body>
    </html>
  );
}