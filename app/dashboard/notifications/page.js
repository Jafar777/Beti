'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { IoNotificationsOutline } from "react-icons/io5";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
    
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        // In real app, fetch from your API
        // const response = await fetch(`/api/notifications?userId=${session.user.id}`);
        // const data = await response.json();
        
        // Mock data
        const mockNotifications = [
          { 
            id: 1, 
            title: "New message", 
            text: "Ahmed sent you a new message about your property", 
            time: "2 min ago", 
            read: false,
            type: "message"
          },
          { 
            id: 2, 
            title: "Property viewed", 
            text: "Your property was viewed 15 times today", 
            time: "1 hour ago", 
            read: true,
            type: "analytics"
          },
          { 
            id: 3, 
            title: "New like", 
            text: "Mohammed liked your property in Damascus", 
            time: "3 hours ago", 
            read: true,
            type: "like"
          },
          { 
            id: 4, 
            title: "Subscription renewal", 
            text: "Your subscription will renew in 3 days", 
            time: "1 day ago", 
            read: false,
            type: "subscription"
          },
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setLoading(false);
      }
    };
    
    if (session) {
      fetchNotifications();
    }
  }, [session, status, router]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#375171] flex items-center">
          <IoNotificationsOutline className="mr-3" />
          {t.notifications || 'Notifications'}
        </h1>
        
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-[#375171] text-white px-4 py-2 rounded-lg"
            >
              {t.markAllRead || 'Mark all as read'}
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <IoNotificationsOutline className="mx-auto text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.noNotifications || 'No notifications yet'}
            </h3>
            <p className="text-gray-500">
              {t.noNotificationsDesc || 'Your notifications will appear here when you have new activity.'}
            </p>
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 border-b border-gray-200 flex items-start ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'like' ? 'bg-red-100 text-red-600' :
                    notification.type === 'analytics' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <IoNotificationsOutline className="text-xl" />
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className={`text-lg font-medium ${
                      !notification.read ? 'text-blue-800' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h3>
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {t.markAsRead || 'Mark as read'}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mt-1">
                    {notification.text}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}