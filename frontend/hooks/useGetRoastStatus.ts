import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiError } from '@/lib/errors';
import { type RoastStatus } from '@/app/roast/[id]/_types/roast';

export interface RoastStatusResponse {
  status: RoastStatus;
  shareSlug: string | null;
  errorMessage: string | null;
}

async function fetchRoastStatus(roastId: string): Promise<RoastStatusResponse> {
  const res = await api.get(`/roast/status/${roastId}`);
  return res.data;
}

export function useGetRoastStatus(roastId: string) {
  return useQuery<RoastStatusResponse, ApiError>({
    queryKey: ['roast_status', roastId],
    queryFn: () => fetchRoastStatus(roastId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'DONE' || status === 'FAILED') return false;
      return 3000;
    },
    refetchOnWindowFocus: false,
  });
}
