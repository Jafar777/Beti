'use client';
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { IoSettingsSharp } from "react-icons/io5";
import { CiUser, CiLogout } from "react-icons/ci";
import { BsFillHouseAddFill } from "react-icons/bs";
import { AiFillDashboard } from "react-icons/ai";
import { RiVipDiamondFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(pathname !== '/dashboard');
  }, [pathname]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const isActive = (href) => {
    return pathname === href || (pathname.startsWith(`${href}/`) && href !== '/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-black">
      {/* Conditionally render sidebar only on desktop */}
      {!isMobile && sidebarOpen && (
        <div className="w-64 bg-[#375171] text-white min-h-screen p-4 flex flex-col rounded-4xl">
          <div className="mb-8 mt-4 flex flex-col items-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border-4 border-white mb-4"
              />
            ) : (
              <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                <CiUser className="text-4xl text-gray-500" />
              </div>
            )}
            <h2 className="text-xl font-bold">{session.user.name}</h2>
            <p className="text-sm opacity-80">{session.user.email}</p>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    pathname === '/dashboard' ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <AiFillDashboard className="text-xl" />
                  <span>{t.dashboard || 'Dashboard'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/settings') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <IoSettingsSharp className="text-xl" />
                  <span>{t.profileSettings || 'Profile Settings'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/listings"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/listings') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <BsFillHouseAddFill className="text-xl" />
                  <span>{t.yourListings || 'Your Listings'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/liked"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/liked') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <FaHeart className="text-xl" />
                  <span>{t.liked || 'Liked'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/chat"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/chat') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <IoChatboxEllipses className="text-xl" />
                  <span>{t.chat || 'Chat'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/notifications"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/notifications') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <IoNotifications className="text-xl" />
                  <span>{t.notifications || 'Notifications'}</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/subscription"
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2d4360] transition ${
                    isActive('/dashboard/subscription') ? 'bg-[#2d4360]' : ''
                  }`}
                >
                  <RiVipDiamondFill className="text-xl" />
                  <span>{t.subscription || 'Subscription'}</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push('/');
            }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition mt-auto"
          >
            <CiLogout className="text-xl" />
            <span>{t.signOut || 'Sign Out'}</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}