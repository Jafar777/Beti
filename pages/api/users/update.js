import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get session using getServerSession
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { userId, firstName, lastName, mobile, image } = req.body;

  await dbConnect();

  try {
    // Check if mobile is being updated and if it's taken by another user
    if (mobile) {
      const existingUser = await User.findOne({ 
        mobile,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Mobile number already in use' });
      }
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (mobile) updateFields.mobile = mobile;
    if (image) updateFields.image = image;

    // If no fields to update, return error
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}