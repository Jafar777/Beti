// utils/subscription.js
export const PLANS = {
  free: {
    price: 0,
    listings: 1,
    features: []
  },
  golden: {
    price: 19.99,
    listings: 20,
    features: ['20 listings/month']
  },
  diamond: {
    price: 39.99,
    listings: 40,
    features: ['40 listings/month', '2 featured listings']
  }
};

// Free plan limits
const FREE_PLAN_LIMITS = {
  maxListings: 3,
  maxFeatured: 0
};

// Premium plan limits
const PREMIUM_PLAN_LIMITS = {
  maxListings: 20,
  maxFeatured: 5
};

// Check if user can create a new listing
export const canCreateListing = (user) => {
  const plan = user.subscription.plan;
  const limits = plan === 'premium' ? PREMIUM_PLAN_LIMITS : FREE_PLAN_LIMITS;
  
  return user.subscription.listingsUsed < limits.maxListings;
};

// Check if user can feature a listing
export const canFeatureListing = (user) => {
  const plan = user.subscription.plan;
  const limits = plan === 'premium' ? PREMIUM_PLAN_LIMITS : FREE_PLAN_LIMITS;
  
  if (plan === 'free') return false;
  
  return user.subscription.featuredListings.length < limits.maxFeatured;
};