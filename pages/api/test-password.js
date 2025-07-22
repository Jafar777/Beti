// pages/api/test-password.js
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
  const { password, hash } = req.body;
  const isValid = bcrypt.compareSync(password, hash);
  res.status(200).json({ isValid });
}