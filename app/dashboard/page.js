'use client';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.dashboard || 'Dashboard'}
      </h1>
      
      <div className="mb-8">
        <p className="text-xl">
          {t.welcomeBack || 'Welcome back'}, <span className="font-semibold">{session.user.name}</span>!
        </p>
        <p className="text-gray-600 mt-2">
          {t.dashboardDesc || 'Manage your account and listings from here'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#375171]">
          <h2 className="text-xl font-bold text-[#375171] mb-2">
            {t.yourProfile || 'Your Profile'}
          </h2>
          <p className="mb-4">{t.profileDesc || 'View and edit your personal information'}</p>
          <Link 
            href="/dashboard/settings" 
            className="text-[#375171] font-medium hover:underline"
          >
            {t.manageProfile || 'Manage Profile →'}
          </Link>
        </div>
        
        {/* Add more dashboard cards as needed */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            {t.yourListings || 'Your Listings'}
          </h2>
          <p className="mb-4">{t.listingsDesc || 'Manage your property listings'}</p>
          <Link 
            href="/dashboard/listings" 
            className="text-green-700 font-medium hover:underline"
          >
            {t.viewListings || 'View Listings →'}
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            {t.subscription || 'Subscription'}
          </h2>
          <p className="mb-4">{t.subscriptionDesc || 'Manage your subscription plan'}</p>
          <Link 
            href="/dashboard/subscription" 
            className="text-blue-700 font-medium hover:underline"
          >
            {t.viewPlan || 'View Plan →'}
          </Link>
        </div>
      </div>
    </div>
  );
}