import { LanguageProvider } from '@/context/LanguageContext';
import '../app/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}