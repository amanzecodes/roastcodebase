'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { type ApiError } from '@/lib/errors';

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  language: string | null;
  starCount: number;
  updatedAt: string;
  defaultBranch: string;
  roast: {
    id: string;
    shareSlug: string | null;
    createdAt: string;
  } | null;
}

async function fetchRepos(): Promise<Repo[]> {
  const res = await api.get('/repos');
  return res.data.repos;
}

export function useRepos() {
  const { data: repos, isLoading, isError, error } = useQuery<Repo[], ApiError>({
    queryKey: ['repos'],
    queryFn: fetchRepos,
    retry: false,
    refetchOnWindowFocus: false
  });

  return { repos, isLoading, isError, error };
}
