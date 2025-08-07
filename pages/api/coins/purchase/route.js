import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  
  const { userId, coins, price, currency } = await req.json();
  
  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: `${coins} Coins`,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/coins`,
      metadata: { userId, coins: coins.toString() }
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' }, 
      { status: 500 }
    );
  }
}