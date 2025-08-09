// app/dashboard/page.js
'use client';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import Link from 'next/link';
import { 
  FaHome, 
  FaStar, 
  FaCoins, 
  FaBell, 
  FaPlus, 
  FaList, 
  FaCog, 
  FaHeart,
  FaChartLine,
  FaDollarSign,
  FaBolt,
  FaHistory
} from "react-icons/fa";
import { PiCoinFill } from "react-icons/pi";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};

  // Mock data - replace with real API calls
  const dashboardStats = {
    totalListings: 8,
    featuredListings: 3,
    coins: session?.user?.coins || 50,
    unreadNotifications: 2,
    propertiesViewed: 24,
    leadsGenerated: 5
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#375171]">
          {t.dashboard || 'Dashboard'}
        </h1>
        <p className="text-gray-600 mt-2">
          {t.welcomeBack || 'Welcome back'}, <span className="font-semibold text-[#375171]">{session?.user?.name}</span>!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FaHome className="text-blue-500" />}
          title={t.totalListings || "Total Listings"}
          value={dashboardStats.totalListings}
          link="/dashboard/listings"
          linkText={t.manageListings || "Manage Listings"}
        />
        
        <StatCard 
          icon={<FaStar className="text-yellow-500" />}
          title={t.featuredListings || "Featured Listings"}
          value={dashboardStats.featuredListings}
          link="/dashboard/listings?filter=featured"
          linkText={t.viewFeatured || "View Featured"}
        />
        
        <StatCard 
          icon={<PiCoinFill className="text-amber-500" />}
          title={t.coins || "Coins"}
          value={dashboardStats.coins}
          link="/dashboard/coins"
          linkText={t.buyCoins || "Buy More Coins"}
          isCurrency={true}
        />
        
        <StatCard 
          icon={<FaBell className="text-purple-500" />}
          title={t.notifications || "Notifications"}
          value={dashboardStats.unreadNotifications}
          link="/dashboard/notifications"
          linkText={t.viewAll || "View All"}
          isBadge={true}
        />
        
        <StatCard 
          icon={<FaChartLine className="text-green-500" />}
          title={t.views || "Property Views"}
          value={dashboardStats.propertiesViewed}
          description={t.last7Days || "Last 7 days"}
        />
        
        <StatCard 
          icon={<FaDollarSign className="text-emerald-500" />}
          title={t.leads || "Leads Generated"}
          value={dashboardStats.leadsGenerated}
          description={t.potentialBuyers || "Potential buyers"}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBolt className="text-yellow-500 mr-2" />
          {t.quickActions || "Quick Actions"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton 
            icon={<FaPlus />}
            text={t.addProperty || "Add Property"}
            href="/dashboard/listings/new"
            color="bg-green-500 hover:bg-green-600"
          />
          
          <ActionButton 
            icon={<FaList />}
            text={t.viewListings || "View Listings"}
            href="/dashboard/listings"
            color="bg-blue-500 hover:bg-blue-600"
          />
          
          <ActionButton 
            icon={<FaCog />}
            text={t.profileSettings || "Profile Settings"}
            href="/dashboard/settings"
            color="bg-purple-500 hover:bg-purple-600"
          />
          
          <ActionButton 
            icon={<FaHeart />}
            text={t.liked || "Liked Properties"}
            href="/dashboard/liked"
            color="bg-red-500 hover:bg-red-600"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHistory className="text-gray-500 mr-2" />
          {t.recentActivity || "Recent Activity"}
        </h2>
        
        <div className="space-y-4">
          <ActivityItem 
            icon={<FaBell />}
            title={t.newMessage || "New message from Ahmed"}
            description={t.aboutProperty || "Regarding your property in Damascus"}
            time="2 hours ago"
          />
          
          <ActivityItem 
            icon={<FaStar />}
            title={t.featuredAdded || "Property featured"}
            description={t.villaDamascus || "Your villa in Damascus is now featured"}
            time="1 day ago"
          />
          
          <ActivityItem 
            icon={<FaCoins />}
            title={t.coinsAdded || "Coins purchased"}
            description={`+100 ${t.coins || "coins"} added to your account`}
            time="2 days ago"
          />
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/dashboard/notifications" 
            className="text-[#375171] font-medium hover:underline"
          >
            {t.viewAllActivity || "View all activity"} →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, link, linkText, isCurrency = false, isBadge = false, description }) {
    const { language, translations } = useLanguage();
  const t = translations[language] || {};
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-opacity-20 mr-3">
                {icon}
              </div>
              <h3 className="text-gray-700 font-medium">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-[#375171]">
              {isCurrency ? <FaDollarSign className="inline mr-1" /> : ''}
              {value}
              {isBadge && (
                <span className="ml-2 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                  {t.new || "New"}
                </span>
              )}
            </p>
            {description && (
              <p className="text-gray-500 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {link && (
        <div className="bg-gray-50 px-5 py-3">
          <Link 
            href={link} 
            className="text-[#375171] text-sm font-medium hover:underline flex items-center"
          >
            {linkText}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

// Action Button Component
function ActionButton({ icon, text, href, color }) {
  return (
    <Link 
      href={href}
      className={`${color} text-white rounded-lg p-4 flex flex-col items-center justify-center transition-colors shadow-md hover:shadow-lg`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="text-center font-medium">{text}</span>
    </Link>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time }) {
  return (
    <div className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="p-2 bg-gray-100 rounded-full mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-gray-400 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}