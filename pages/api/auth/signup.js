import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword } from '@/lib/passwordUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, mobile: rawMobile, password: rawPassword } = req.body;
  const mobile = rawMobile.trim();
  const password = rawPassword;

  try {
    await dbConnect();

    // Validate mobile format
    if (!/^09\d{8}$/.test(mobile)) {
      return res.status(400).json({ error: 'Invalid Syrian mobile number format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Hash password using our utility
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      mobile,
      password: hashedPassword,
      coins: 50  // Starting coins

    });

    await newUser.save();
    
    console.log(`User created: ${newUser._id}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}