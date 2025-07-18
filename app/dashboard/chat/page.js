'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
    
    // Fetch user's conversations
    const fetchConversations = async () => {
      try {
        // In real app, fetch from your API
        // const response = await fetch(`/api/chat/conversations?userId=${session.user.id}`);
        // const data = await response.json();
        
        // Mock data
        const mockConversations = [
          { id: 1, name: "Property Owner", lastMessage: "Hello, is the property still available?", unread: 3 },
          { id: 2, name: "Real Estate Agent", lastMessage: "I have a new property that might interest you", unread: 0 },
          { id: 3, name: "Potential Buyer", lastMessage: "When can we schedule a viewing?", unread: 1 },
        ];
        
        setConversations(mockConversations);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setLoading(false);
      }
    };
    
    if (session) {
      fetchConversations();
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#375171] mb-6">
        {t.chat || 'Messages'}
      </h1>
      
      {conversations.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {t.noConversations || 'You have no messages yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{conversation.name}</div>
                <div className="text-gray-600 text-sm">{conversation.lastMessage}</div>
              </div>
              
              {conversation.unread > 0 && (
                <div className="bg-[#375171] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}