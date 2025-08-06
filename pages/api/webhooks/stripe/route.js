import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');
  
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, coins } = session.metadata;
      
      // Add coins to user
      await User.findByIdAndUpdate(userId, {
        $inc: { coins: parseInt(coins) }
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}