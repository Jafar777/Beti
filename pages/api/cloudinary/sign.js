import cloudinary from 'cloudinary';

export default function handler(req, res) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.status(200).json({ signature, timestamp });
}