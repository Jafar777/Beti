// In pages/api/dashboard.jsx
'use client';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {session?.user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {session.user.firstName} {session.user.lastName}
          </h2>
          <p className="mb-2"><strong>Mobile:</strong> {session.user.mobile}</p>
          <p><strong>Coins:</strong> {session.user.coins || 0}</p>
        </div>
      ) : (
        <p>Please sign in to access your dashboard</p>
      )}
    </div>
  );
}