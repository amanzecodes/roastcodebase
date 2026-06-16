import { Roast } from "@/app/roast/[id]/_types/roast";
import api from "@/lib/api";
import { ApiError } from "@/lib/errors";
import { useQuery } from "@tanstack/react-query";

async function getRoast(id: string): Promise<Roast> {
    const res = await api.get(`/roast/${id}`);
    return res.data
}
export function useGetRoast(id: string) {
    return useQuery<Roast, ApiError>({
        queryKey: ['get_roast', id],
        queryFn: () => getRoast(id),
        refetchOnWindowFocus: false
    })
}

