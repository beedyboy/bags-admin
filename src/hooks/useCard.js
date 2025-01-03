import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addSingleCard, getCards, addBulkCard, activateCard, suspendCard, requestFund, rejectFundRequest, getCardDetails, getCardTransactions, chargeCard, acceptFundRequest, fetchCardReport, fetchDashboardActivities, getSingleCardByCode } from "../apis/card";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import useCardStore from "../stores/CardStore";
import moment from "moment";

// Fetch Cards Hook
export const useFetchCards = (status, searchQuery = "") => {
    return useQuery({
        queryKey: ["cards", status, searchQuery],
        queryFn: async () => {
            const { data } = await getCards(status);
            return data?.data || [];
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

// Create Single Card Hook
export const useCreateSingleCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload) => {
            return addSingleCard(payload);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries(["cards", "active"]); // Refresh "active" cards
            toast.success(res?.data?.message || "Card created successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create card", {
                position: "top-right",
            });
        },
    });
};

// Create Bulk Cards Hook
export const useCreateBulkCards = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bulkData) => {
            return addBulkCard(bulkData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cards"]); // Refresh all cards
            toast.success("Bulk cards created successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create bulk cards", {
                position: "top-right",
            });
        },
    });
};

// Activate Card Hook
export const useActivateCard = () => {
    const queryClient = useQueryClient();
    const location = useLocation();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            return activateCard(id, data);
        },
        onSuccess: (res) => {
            if (location.pathname.includes("/card-details")) {
                queryClient.invalidateQueries(["cardDetails", res?.data?.id]);
            } else {
                queryClient.invalidateQueries(["cards"]);
            }

            toast.success(res?.data?.message || "Card activated successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to activate card", {
                position: "top-right",
            });
        },
    });
};

// Suspend/Deactivate Card Hook
export const useSuspendCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            return suspendCard(id);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries(["cards"]); // Refresh all cards
            toast.success(res?.data?.message || "Card suspended successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to suspend card", {
                position: "top-right",
            });
        },
    });
};

// Request Funds Hook
export const useRequestFunds = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            return requestFund(id, data);
        },
        onSuccess: (_, { id }) => {
            if (location.pathname.match(/\/card-management\/\d+/)) {
                queryClient.invalidateQueries(["cardTransactions", id]);
            }
            toast.success("Funds requested successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to request funds", {
                position: "top-right",
            });
        },
    });
};

// Reject Fund Request Hook
export const useRejectFundRequest = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    return useMutation({
        mutationFn: async (id) => {
            return rejectFundRequest(id);
        },
        onSuccess: (res, { id }) => {
            if (location.pathname.match(/\/card-management\/\d+/)) {
                queryClient.invalidateQueries(["cardTransactions", id]);
            }
            toast.success(res.data.message || "Fund request rejected successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to reject fund request", {
                position: "top-right",
            });
        },
    });
};

export const useAcceptFundRequest = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    return useMutation({
        mutationFn: async (id) => {
            return acceptFundRequest(id);
        },
        onSuccess: (res, { id }) => {
            if (location.pathname.match(/\/card-management\/\d+/)) {
                queryClient.invalidateQueries(["cardTransactions", id]);
            }
            toast.success(res.data.message || "Fund request accepted successfully", {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to accept fund request", {
                position: "top-right",
            });
        },
    });
};

export const useFetchCardDetails = (cardId) => {
    return useQuery({
        queryKey: ["cardDetails", cardId],
        queryFn: async () => {
            const { data } = await getCardDetails(cardId);
            return data?.data || {};
        },
        enabled: !!cardId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        onError: (error) => {
            console.error("Error fetching card details:", error);
        },
    });
};

export const useFetchCardTransactions = (cardId) => {
    return useQuery({
        queryKey: ["cardTransactions", cardId],
        queryFn: async () => {
            const { data } = await getCardTransactions(cardId);
            return data?.data || [];
        },
        enabled: !!cardId, // Fetch only if cardId is provided
        staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
        onError: (error) => {
            console.error("Error fetching card transactions:", error);
        },
    });
};

export const useCharge = () => {
    const queryClient = useQueryClient();
    const location = useLocation();

    const { setTransactionPreview, toggleChargeCardModal } = useCardStore();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            return chargeCard(id, data);
        },
        onSuccess: (res, { id }) => {
            if (location.pathname.match(/\/card-management\/\d+/)) {
                queryClient.invalidateQueries(["cardTransactions", id]);
                toggleChargeCardModal();
            } else if (location.pathname.match(/\/cashier/)) {
                const data = res.data.data;
                // queryClient.invalidateQueries(["cardByCode", barcode]);
                setTransactionPreview(data);
            }
            toast.success(res.data.message, {
                position: "top-right",
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to charge card", {
                position: "top-right",
            });
        },
    });
};

export const useCardReport = (filters) => {
    return useQuery({
        queryKey: ["cardReport", filters],
        queryFn: async () =>
        {
            const dateFormat = "DD-MM-YYYY";
            const { dateRange, ...restFilters } = filters || {};
            let startDate = null;
            let endDate = null;

            if (dateRange) {
                const [start, end] = dateRange;
                startDate = start ? moment(new Date(start)).format(dateFormat) : null;
                endDate = end ? moment(new Date(end)).format(dateFormat) : null;
            }

            const payload = {
                ...restFilters,
                startDate,
                endDate,
            };
            const { data } = await fetchCardReport(payload);
            return data || {};
        },
        enabled: !!filters,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCardsActivitiesReport = (filters) => {
    return useQuery({
        queryKey: ["cardActivitiesReport", filters],
        queryFn: async () => {
            const dateFormat = "DD-MM-YYYY";
            const { dateRange, ...restFilters } = filters || {};
            let startDate = null;
            let endDate = null;

            if (dateRange) {
                const [start, end] = dateRange;
                startDate = start ? moment(new Date(start)).format(dateFormat) : null;
                endDate = end ? moment(new Date(end)).format(dateFormat) : null;
            }

            const payload = {
                ...restFilters,
                startDate,
                endDate,
            };

            const { data } = await fetchDashboardActivities(payload);
            return data || [];
        },
        enabled: !!filters,
        staleTime: 5 * 60 * 1000,
    });
};

export const useFetchCardByCode = (code, options = {}) => {
    return useQuery({
        queryKey: ["cardByCode", code],
        queryFn: async () => {
            // log time of call
            console.log("Fetching card by code: ", new Date().toLocaleTimeString());

            if (!code) throw new Error("Code is required");
            const { data } = await getSingleCardByCode(code);
            return data || null;
        },
        enabled: !!code,
        ...options,
    });
};
