// pages/api/subscriptions/create-checkout-session.js
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { PLANS } from '@/utils/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { plan } = req.body;
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  
  // Validate plan
  if (!PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const user = await User.findById(session.user.id);
  
  // Create Stripe checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        },
        unit_amount: PLANS[plan].price * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    metadata: {
      userId: user._id.toString(),
      plan
    }
  });

  res.status(200).json({ id: stripeSession.id });
}