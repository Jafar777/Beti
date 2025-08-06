'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { PiCoin } from "react-icons/pi";

export default function CoinPurchasePage() {
  const { data: session } = useSession();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  const [stripe, setStripe] = useState(null);
  
  const coinPackages = [
    { coins: 50, price: 5 },
    { coins: 100, price: 10 },
    { coins: 200, price: 20 },
    { coins: 500, price: 50 },
    { coins: 1000, price: 100 },
    { coins: 5000, price: 500 },
  ];

  useEffect(() => {
    // Dynamically load Stripe to avoid server-side issues
    const loadStripe = async () => {
      if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        const { loadStripe } = await import('@stripe/stripe-js');
        return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      }
      return null;
    };

    loadStripe().then(setStripe);
  }, []);

  const handlePurchase = async (coins, price) => {
    if (!stripe) {
      console.error('Stripe not initialized');
      return;
    }
    
    try {
      const response = await fetch('/api/coins/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: session.user.id,
          coins,
          price,
          currency: 'USD'
        })
      });

      const sessionData = await response.json();
      
      if (sessionData.id) {
        await stripe.redirectToCheckout({ sessionId: sessionData.id });
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center mb-8">
        <PiCoin className="text-4xl text-[#375171] mr-4" />
        <h1 className="text-3xl font-bold text-[#375171]">
          {t.buyCoins || 'Buy Coins'}
        </h1>
      </div>

      {session?.user?.coins !== undefined && (
        <div className="bg-blue-50 p-4 rounded-lg mb-8 max-w-md">
          <p className="text-lg font-medium">
            {t.yourCoins || 'Your coins'}: 
            <span className="flex items-center ml-2 text-[#375171] font-bold">
              <PiCoin className="mr-1" /> {session.user.coins}
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coinPackages.map((pkg, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-xl shadow-md overflow-hidden"
          >
            <div className="bg-[#375171] p-6 text-center">
              <div className="flex justify-center items-center mb-4">
                <PiCoin className="text-3xl text-yellow-400 mr-2" />
                <span className="text-4xl font-bold text-white">
                  {pkg.coins}
                </span>
              </div>
              <p className="text-white text-lg">{t.coins || 'Coins'}</p>
            </div>
            
            <div className="bg-white p-6">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold">${pkg.price}</p>
                <p className="text-gray-600 mt-1">
                  ${(pkg.price / pkg.coins).toFixed(2)}/{t.coin || 'coin'}
                </p>
              </div>
              
              <button
                onClick={() => handlePurchase(pkg.coins, pkg.price)}
                className="w-full bg-[#375171] hover:bg-[#2d4360] text-white py-3 rounded-lg font-medium disabled:bg-gray-400 cursor-pointer"
                disabled={!stripe}
              >
                {stripe ? (t.buyNow || 'Buy Now') : (t.loading || 'Loading...')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}