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

export const canCreateListing = (user) => {
  const plan = PLANS[user.subscription.plan];
  return user.subscription.listingsUsed < plan.listings;
};

export const canFeatureListing = (user) => {
  if (user.subscription.plan !== 'diamond') return false;
  return user.subscription.featuredListings.length < 2;
};