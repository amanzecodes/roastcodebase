'use client';

import { useAuthContext } from '@/providers/AuthProvider';

export function useAuth() {
  const { user, isLoading, isAuthenticated, refetch } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,
  };
}