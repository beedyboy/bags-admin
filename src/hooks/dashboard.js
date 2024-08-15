import { useQuery } from "@tanstack/react-query";
import Utils from "../shared/localStorage";
import { getStats } from "../apis/dashboard";

export const useGetDashboardStats = () => {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const { data } = await getStats();
            return data?.data || [];
        },
        refetchOnWindowFocus: true,
        staleTime: 6000000,
        enabled: Utils.isAuthenticated(),
    });
};
