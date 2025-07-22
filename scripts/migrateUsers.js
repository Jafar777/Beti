import dbConnect from '../lib/dbConnect';
import User from '../models/User';

async function migrateUsers() {
  await dbConnect();
  
  // Update all users to ensure likedProperties exists
  const result = await User.updateMany(
    { $or: [
      { likedProperties: { $exists: false } },
      { likedProperties: null }
    ]},
    { $set: { likedProperties: [] } }
  );
  
  console.log(`Updated ${result.modifiedCount} users`);
  process.exit(0);
}

migrateUsers();