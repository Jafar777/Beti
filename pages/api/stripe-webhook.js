// pages/api/stripe-webhook.js
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    await dbConnect();
    
    const user = await User.findById(session.metadata.userId);
    if (!user) return;
    
    // Update user subscription
    user.subscription.plan = session.metadata.plan;
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date();
    user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
    user.subscription.listingsUsed = 0;
    
    await user.save();
  }

  res.status(200).json({ received: true });
}