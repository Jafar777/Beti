'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { RiVipDiamondLine } from "react-icons/ri";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language, translations } = useLanguage();
  const t = translations[language] || {};
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
    
    // Fetch subscription plans and user's current plan
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/subscription');
        // const data = await response.json();
        
        // Mock data
        const mockPlans = [
          {
            id: 'free',
            name: 'Free',
            price: 0,
            currency: 'SYP',
            features: [
              '5 property listings',
              'Basic property details',
              'Contact via phone only',
              'Standard visibility'
            ],
            color: 'bg-gray-200'
          },
          {
            id: 'golden',
            name: 'Golden',
            price: 50000,
            currency: 'SYP',
            features: [
              '20 property listings',
              'Enhanced property details',
              'Contact via phone and email',
              'Priority visibility',
              'Property analytics'
            ],
            color: 'bg-yellow-100'
          },
          {
            id: 'diamond',
            name: 'Diamond',
            price: 100000,
            currency: 'SYP',
            features: [
              'Unlimited property listings',
              'Premium property details',
              'Direct messaging',
              'Top priority visibility',
              'Advanced analytics',
              'Featured property badge'
            ],
            color: 'bg-blue-100'
          }
        ];
        
        setPlans(mockPlans);
        
        // Mock current plan (in real app, get from user data)
        setCurrentPlan('free'); // Default to free plan
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
        setLoading(false);
      }
    };
    
    if (session) {
      fetchData();
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
        {t.subscription || 'Subscription Plans'}
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-3xl">
        {t.subscriptionDesc || 'Choose the plan that works best for you. Upgrade or downgrade at any time.'}
      </p>
      
      {currentPlan && (
        <div className="mb-8 p-4 bg-green-50 rounded-lg max-w-3xl">
          <p className="text-green-700">
            <span className="font-semibold">{t.currentPlan || 'Your current plan:'} </span>
            {plans.find(p => p.id === currentPlan)?.name || 'Free'}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`rounded-xl shadow-lg overflow-hidden ${
              currentPlan === plan.id 
                ? 'ring-4 ring-blue-500 transform scale-[1.03]' 
                : 'border border-gray-200'
            } transition-all duration-300`}
          >
            <div className={`${plan.color} p-6 text-center`}>
              <div className="flex justify-center mb-4">
                <RiVipDiamondLine className={`text-4xl ${
                  plan.id === 'free' ? 'text-gray-500' : 
                  plan.id === 'golden' ? 'text-yellow-500' : 
                  'text-blue-500'
                }`} />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                {plan.name}
              </h2>
              
              <div className="text-3xl font-bold mb-2">
                {plan.price === 0 
                  ? t.free || 'Free' 
                  : `${plan.price.toLocaleString()} ${plan.currency}`
                }
              </div>
              
              <p className="text-sm text-gray-600">
                {plan.id === 'free' 
                  ? t.freePlanDesc || 'Basic features' 
                  : plan.id === 'golden' 
                    ? t.goldenPlanDesc || 'Enhanced visibility' 
                    : t.diamondPlanDesc || 'Premium experience'
                }
              </p>
            </div>
            
            <div className="bg-white p-6">
              <h3 className="font-bold mb-4">
                {t.features || 'Features'}:
              </h3>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 rounded-lg font-medium ${
                  currentPlan === plan.id
                    ? 'bg-gray-300 text-gray-700 cursor-default'
                    : plan.id === 'free'
                      ? 'bg-[#375171] hover:bg-[#2d4360] text-white'
                      : plan.id === 'golden'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id
                  ? t.currentPlan || 'Current Plan'
                  : plan.id === 'free'
                    ? t.selectPlan || 'Select Plan'
                    : t.upgrade || 'Upgrade Now'
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}