'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  language: string | null;
  starCount: number;
  updatedAt: string;
  defaultBranch: string;
}

async function fetchRepos(): Promise<Repo[]> {
  const res = await api.get('/repos');
  return res.data.repos;
}

export function useRepos() {
  const { data: repos, isLoading, isError, error } = useQuery({
    queryKey: ['repos'],
    queryFn: fetchRepos,
    retry: false,
  });

  return { repos, isLoading, isError, error };
}