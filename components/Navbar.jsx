'use client'
import { signIn, signOut} from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { AiOutlineGlobal, AiOutlineDashboard } from "react-icons/ai";
import { CiLogin, CiUser, CiLogout } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoNotificationsOutline } from "react-icons/io5"; // Added notifications icon
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fulllogo from "@/assets/Fulllogo.svg";
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar({session, refreshSession}) {
  const router = useRouter();
  const { language, translations, toggleLanguage } = useLanguage();
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // State for notifications
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null); // Ref for notifications dropdown
  const [imageVersion, setImageVersion] = useState(0);
  const [notifications, setNotifications] = useState([]); // State for notifications

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Refresh image when session changes
  useEffect(() => {
    if (session?.user?.image) {
      setImageVersion(prev => prev + 1);
    }
  }, [session]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      
      // Close notifications menu
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add property button handler
  const handleAddProperty = () => {
    router.push('/dashboard/listings');
  };

  // Fetch notifications (mock data for now)
  useEffect(() => {
    if (session) {
      // In a real app, you would fetch from your API
      const mockNotifications = [
        { id: 1, text: "New message from Ahmed", time: "2 min ago", read: false },
        { id: 2, text: "Your property was viewed 15 times", time: "1 hour ago", read: true },
        { id: 3, text: "Mohammed liked your property", time: "3 hours ago", read: true },
      ];
      setNotifications(mockNotifications);
    }
  }, [session]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Container */}
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Left Section - Desktop: Language & Add Property */}
          <div className="hidden md:flex items-center space-x-4 flex-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-[#375171] text-white px-2 py-3 rounded-lg text-base font-bold"
            >
              <AiOutlineGlobal className="h-5 w-5" />
              <span>{t.language}</span>
            </button>
            
            {session && (
              <button 
                onClick={handleAddProperty}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-2 py-3  rounded-lg text-base font-bold"
              >
                <IoMdAdd className="h-5 w-5" />
                <span>{t.addProperty}</span>
              </button>
            )}
          </div>
          
          {/* Left Section - Mobile: User Image */}
          <div className="md:hidden flex items-center flex-1">
            {session?.user && (
              <div className="flex-shrink-0">
                {session.user.image ? (
                  <img 
                    src={`${session.user.image}?v=${imageVersion}`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 rounded-xl w-10 h-10" />
                )}
              </div>
            )}
          </div>
          
          {/* Center Section - Logo (Perfectly Centered) */}
          <div className="flex justify-center flex-1">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src={Fulllogo}
                  alt="Logo"
                  width={150}
                  height={40}
                  className="mx-auto cursor-pointer"
                />
              </Link>
            </div>
          </div>
          
          {/* Right Section - Desktop: Auth */}
          <div className="hidden md:flex items-center justify-end flex-1 space-x-4">
            {/* Notifications button */}
            {session && (
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <IoNotificationsOutline className="h-6 w-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-[-200px] mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold">{t.notifications || 'Notifications'}</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        {t.markAllRead || 'Mark all as read'}
                      </button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-black">
                          {t.noNotifications || 'No notifications yet'}
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 text-black ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between">
                              <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.text}
                              </p>
                              {!notification.read && (
                                <span className="bg-blue-500 rounded-full w-2 h-2"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 text-center border-t border-gray-200">
                      <Link 
                        href="/dashboard/notifications"
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        {t.viewAll || 'View all notifications'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                      refreshSession();
                    }}
                    className="flex items-center space-x-3 focus:outline-none"
                  >
                    {session.user.image ? (
                      <img 
                        src={`${session.user.image}?v=${imageVersion}`} 
                        alt="User" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-[#375171] border-2 rounded-full w-14 h-14 flex items-center justify-center cursor-pointer">
                        <CiUser className="text-white text-xl" />
                      </div>
                    )}
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <AiOutlineDashboard className="mr-2" />
                        <span>{t.dashboard || 'Dashboard'}</span>
                      </button>
                      <button
                        onClick={async () => {
                          await signOut({ redirect: false });
                          window.location.href = "/";
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <CiLogout className="mr-2" />
                        <span>{t.signOut || 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-2 bg-[#375171] hover:bg-[#2d4360] text-white px-4 py-3 rounded-lg text-lg"
              >
                <CiLogin className="h-6 w-6" />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>
          
          {/* Right Section - Mobile: Menu Button */}
          <div className="md:hidden flex items-center justify-end flex-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-1 bg-[#375171] text-white px-3 py-2 rounded-lg text-base"
            >
              <RxHamburgerMenu className="h-5 w-5" />
              <span>{t.menu}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center space-x-2 bg-[#375171] text-white px-4 py-3 rounded-lg text-lg"
            >
              <AiOutlineGlobal className="h-6 w-6" />
              <span>{t.language}</span>
            </button>
            
            {session && (
              <button 
                onClick={handleAddProperty}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg text-lg"
              >
                <IoMdAdd className="h-6 w-6" />
                <span>{t.addProperty}</span>
              </button>
            )}
            
            {session ? (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg text-lg"
                >
                  <span>{t.dashboard || 'Dashboard'}</span>
                </button>
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-[#375171] text-white px-4 py-3 rounded-lg text-lg"
                >
                  <CiLogout className="h-6 w-6" />
                  <span>{t.signOut}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full flex items-center justify-center space-x-2 bg-[#375171] text-white px-4 py-3 rounded-lg text-lg"
              >
                <CiLogin className="h-6 w-6" />
                <span>{t.signIn}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}