'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <p className="text-[#888888]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {user?.avatarUrl && (
            <img src={user.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <h1 className="text-[#EDEDED] font-bold text-xl">Hey, {user?.username} 👋</h1>
            <p className="text-[#888888] text-sm">Ready to get roasted?</p>
          </div>
        </div>

        <p className="text-[#888888]">Roast history will go here.</p>
      </div>
    </div>
  );
}