import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Add coins to user's account
      await User.findByIdAndUpdate(session.metadata.userId, {
        $inc: { coins: parseInt(session.metadata.coins) }
      });
      
      console.log(`Added ${session.metadata.coins} coins to user ${session.metadata.userId}`);
    } catch (err) {
      console.error('Failed to update user coins:', err);
    }
  }

  return NextResponse.json({ received: true });
}