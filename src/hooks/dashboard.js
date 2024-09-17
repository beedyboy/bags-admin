import { useQuery } from "@tanstack/react-query";
import Utils from "../shared/localStorage";
import { getClosedRecords, getStats } from "../apis/dashboard";
import useDashboardStore from "../stores/DashboardStore";
import moment from "moment";


export const useGetDashboardStats = (dashDate) => {
    const { setStats } = useDashboardStore();

    return useQuery({
        queryKey: ["stats", dashDate],
        queryFn: async () => {
            const formatDate = (date) => {
                return moment(date).format('DD-MM-YYYY');
            };

            const startDate = dashDate?.[0] ? formatDate(dashDate[0]) : null;
            const endDate = dashDate?.[1] ? formatDate(dashDate[1]) : startDate;

            const data = await getStats({ startDate, endDate });
            setStats(data.stats);
            return data || {};
        },
        refetchOnWindowFocus: true,
        staleTime: 6000000,
        enabled: Utils.isAuthenticated(),
    });
};

export const useGetClosedRecords = (dashDate) => {
    return useQuery({
        queryKey: ["closed-records", dashDate],
        queryFn: async () => {
            const formatDate = (date) => {
                return moment(date).format('DD-MM-YYYY');
            };

            const startDate = dashDate?.[0] ? formatDate(dashDate[0]) : null;
            const endDate = dashDate?.[1] ? formatDate(dashDate[1]) : startDate;
            const { data } = await getClosedRecords({ startDate, endDate });
            return data?.data || [];
        },
        refetchOnWindowFocus: true,
        staleTime: 6000000,
        enabled: Utils.isAuthenticated(),
    });
};
