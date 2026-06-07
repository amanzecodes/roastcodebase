'use client';

import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types/types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<unknown>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError, refetch } = useQuery<User | null>({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data as User | null;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !isError,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
