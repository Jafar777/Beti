'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const languageContext = useLanguage();
  const language = languageContext?.language || 'en';
  const translations = languageContext?.translations || {};
  const t = translations[language] || {};
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      <h1 className="text-3xl font-bold text-center my-8">{t.dashboard || 'Dashboard'}</h1>
      <div className="container mx-auto p-4">
        <p className="text-xl">{t.welcomeBack || 'Welcome back'}, {session.user.name}!</p>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
}