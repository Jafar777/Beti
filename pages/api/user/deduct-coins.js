import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { amount } = req.body;
    const user = await User.findById(session.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.coins < amount) {
      return res.status(400).json({ error: 'Insufficient coins' });
    }

    user.coins -= amount;
    await user.save();

    res.status(200).json({ 
      success: true, 
      newBalance: user.coins 
    });
  } catch (error) {
    console.error('Coin deduction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}