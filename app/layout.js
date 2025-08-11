import './globals.css';
import ClientProviders from './ClientProviders';
import PageLoader from '@/components/PageLoader';
import LoadingOverlay from '@/components/LoadingOverlay';
import { PropertiesProvider } from '@/context/PropertiesContext';

export const metadata = {
  title: 'بيتي | منصة العقارات الرائدة في سوريا - شراء، بيع، تأجير',
  description: 'اكتشف أفضل العقارات في سوريا! منصة بيتي توفر لك أحدث عروض البيع والشراء والإيجار للمنازل، الشقق، والمحلات التجارية في جميع المدن السورية.',
  keywords: ['عقارات سوريا', 'بيع منزل سوريا', 'شراء شقة دمشق', 'تأجير عقار حلب', 'أسعار العقارات في سوريا', 'بيوت للبيع'],
  authors: [{ name: 'بيتي', url: 'https://www.beti.homes' }],
  metadataBase: new URL('https://www.beti.homes'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
    },
  },
  openGraph: {
    title: 'بيتي | منصة العقارات الرائدة في سوريا',
    description: 'اكتشف أفضل الفرص العقارية في سوريا مع بيتي - حلول ذكية لبيع وشراء وتأجير العقارات',
    url: 'https://www.beti.homes',
    siteName: 'بيتي',
    images: [
      {
        url: '/og-arabic-image.jpg',
        width: 1200,
        height: 630,
        alt: 'منصة بيتي العقارية - واجهة باللغة العربية',
      },
    ],
    locale: 'ar_SY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بيتي | منصة العقارات الرائدة في سوريا',
    description: 'حلول عقارية متكاملة لسوق العقارات السوري - بيع، شراء، تأجير',
    images: ['/twitter-arabic-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "بيتي",
            "image": "/logo.png",
            "@id": "",
            "url": "https://www.beti.homes",
            "telephone": "+963-XXXXXXXXXX",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "شارع الرئيس",
              "addressLocality": "دمشق",
              "postalCode": "XXXXX",
              "addressCountry": "SY"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 33.5138,
              "longitude": 36.2765
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Saturday",
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            },
            "sameAs": [
              "https://www.facebook.com/yourpage",
              "https://www.instagram.com/beti.homes"
            ]
          })}
        </script>
      </head>
      <body>
        <ClientProviders>
          <PropertiesProvider>
            <PageLoader />
            <LoadingOverlay />
            {children}
          </PropertiesProvider>
        </ClientProviders>
      </body>
    </html>
  );
}