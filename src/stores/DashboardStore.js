import create from "zustand";

const useDashboardStore = create((set) => ({
    // State variables
    title: "Dashboard",
    stats: {
        totalAccounts: 0,
        totalReconciliations: 0,
        totalOpenedStageTwoReconciliations: 0,
        totalOpenedReconciliation: 0,
        totalClosedReconciliation: 0,
        totalPartiallyUsedReconciliation: 0,
        totalOverdueReconciliation: 0,
        totalPartiallyUsedReconciliationAmount: 0,
        totalStageOneAmount: 0,
        totalStageTwoAmount: 0,
        totalFinalStageAmount: 0
    },
    loading: false,
    error: false,
    message: "",
    isFiltering: false,
    dashDate: null,
    filterOptions: ["All", "Filter"],
    selectedFilter: "All",
    showClosedData: false,
    // Actions
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setMessage: (message) => set({ message }),
    setIsFiltering: () => set((state) => ({ isFiltering: state.selectedFilter !== "All" })),
    setDashDate: (dashDate) => set({ dashDate }),
    setSelectedFilter: (selectedFilter) =>
    {
        set({ selectedFilter, isFiltering: selectedFilter !== "All" });
        if (selectedFilter === "All")
        {
            alert("All selected");
            set({ dashDate: null });
        }
    },
    // setSelectedFilter: (selectedFilter) => set({ selectedFilter, isFiltering: selectedFilter !== "All" }),
    setShowClosedData: () =>   set((state) => ({ showClosedData: !state.showClosedData })),

}));

export default useDashboardStore;