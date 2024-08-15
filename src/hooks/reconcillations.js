import { useMutation, useQuery } from "@tanstack/react-query";
import Utils from "../shared/localStorage";
import toast from "react-hot-toast";
import { approveStageOne, approveStageTwo, getStageOneList, getStageTwoList, revertRecord, uploadStatement } from "../apis/reconciliation";
import useReconStore from "../stores/ReconStore";

// Utility function to handle API errors
const handleError = (error, defaultMsg) => {
    const message = error.response?.data?.msg || "An unexpected error occurred";
    const errorMsg = error.response?.status === 500 ? defaultMsg : message;

    toast.error(errorMsg, { position: "top-right" });
    console.error(defaultMsg, error.response?.data?.error || message);
};

export const useUploadStatement = () => {
    const { refetch } = useGetStageOneTransactions();
    const { toggleUpload } = useReconStore();

    return useMutation({
        mutationFn: async (data) => await uploadStatement(data), // Adding 'await' for consistency
        onSettled: () => {
            refetch(); // Refetch stage one transactions whether success or error
        },
        onError: (error) => {
            handleError(error, "Error uploading. Please check your network and retry!!!");
        },
        onSuccess: (data) => {
            toggleUpload(); // Toggle the upload state in the store
            console.log("Upload successful:", data.message);
            toast.success(data.message || "Upload successful", {
                position: "top-right",
            });
        },
    });
};

// Hook to get Stage One transactions
export const useGetStageOneTransactions = () => {
    return useQuery({
        queryKey: ["stageOne"],
        queryFn: async () => {
            const { data } = await getStageOneList();
            return data?.data || [];
        },
        refetchOnWindowFocus: true,
        staleTime: 6000000,
        enabled: Utils.isAuthenticated(),
    });
};

// Hook to get Stage Two transactions
export const useGetStageTwoTransactions = () => {
    return useQuery({
        queryKey: ["stageTwo"],
        queryFn: async () => {
            const { data } = await getStageTwoList();
            console.log({ data });
            return data?.data || [];
        },
        refetchOnWindowFocus: true,
        staleTime: 6000000,
        enabled: Utils.isAuthenticated(),
    });
};

// Hook for first approval
export const useFirstApproval = () => {
    const { refetch } = useGetStageOneTransactions();

    return useMutation({
        mutationFn: async (payload) => {
            const { id, ...body } = payload;
            return await approveStageOne(id, body);
        },
        onSuccess: (data) => {
            console.log("First approval successful:", data.message);
            refetch();
            toast.success(data.message || "Approval successful", {
                position: "top-right",
            });
        },
        onError: (error) => {
            handleError(error, "Approval error:");
        },
    });
};

// Hook for second approval
export const useSecondApproval = () => {
    const { refetch } = useGetStageTwoTransactions();

    return useMutation({
        mutationFn: async (payload) => {
            const { id, ...body } = payload;
            return await approveStageTwo(id, body);
        },
        onSuccess: (data) => {
            console.log("Second approval successful:", data.message);
            refetch();
            toast.success(data.message || "Approval successful", {
                position: "top-right",
            });
        },
        onError: (error) => {
            handleError(error, "Second approval error:");
        },
    });
};

// Hook to revert a record
export const useOverturn = () => {
    const { refetch } = useGetStageTwoTransactions();

    return useMutation({
        mutationFn: async () => await revertRecord(),
        onSuccess: (data) => {
            console.log("Second approval successful:", data.message);
            refetch();
            toast.success(data.message || "Revert successful", {
                position: "top-right",
            });
        },
        onError: (error) => {
            handleError(error, "Reversion error:");
        },
    });
};
