import { create } from "zustand";
import backend from "../config";
import moment from "moment";

const useReconStore = create((set, get) => ({
    isStepOneFormOpened: false,
    isStepTwoFormOpened: false,
    upload: false,
    error: false,
    exist: false,
    loading: false,
    stage_one_initial_data: {},
    stage_two_initial_data: {},
    initial_data: {},
    sending: false,
    reverting: false,
    reverted: false,
    removed: false,
    reconcillations: [],
    finalReport: [],
    finales: [],
    brand: [],
    message: "",
    action: null,
    option: "All",
    startDate: "",
    endDate: "",

    toggleUpload: () => set((state) => ({ upload: !state.upload })),

    toggleStepOneForm: () => set((state) => ({ isStepOneFormOpened: !state.isStepOneFormOpened })),
    toggleStepTwoForm: () => set((state) => ({ isStepTwoFormOpened: !state.isStepTwoFormOpened })),

    modifyStepOneData: (data, open) =>
    {
        const { credit_amount, amount_used, balance } = data;
        let deductFrom = credit_amount;
        let amountLeft = credit_amount - (amount_used ?? 0 + balance ?? 0);
        if (amountLeft > 0 && amountLeft < credit_amount)
        {
            deductFrom = amountLeft;
            
        }
        const defaultValues = {
            id: data.id,
            value_date: data.value_date,
            credit_amount: deductFrom,
            amount_used: 0,
            balance: 0,
            approved_one: false,
        };
        set({ stage_one_initial_data: defaultValues, isStepOneFormOpened: open })
    },
    modifyStepTwoData: (data, open) =>
    {
        const { credit_amount, amount_used, balance } = data;
        let deductFrom = credit_amount;
        let amountLeft = credit_amount - (amount_used ?? 0 + balance ?? 0);
        if (amountLeft > 0 && amountLeft < credit_amount)
        {
            deductFrom = amountLeft;
            
        }
        const defaultValues = {
            id: data.id,
            value_date: data.value_date,
            credit_amount: deductFrom,
            amount_used: 0,
            balance: 0,
            approved_one: data.approved_one,
            approved_two: false,
        };
        set({ stage_two_initial_data: defaultValues, isStepTwoFormOpened: open })
    },

    finaleRecord: async () => {
        set({ loading: true });
        try {
            const res = await backend.get("transaction-processing/approved_two/false");
            if (res.status === 200) {
                set({ finales: res.data, loading: false });
            }
        } catch (err) {
            set({ error: err, loading: false });
        }
    },

    getFinalReport: async (data) => {
        set({ loading: true, sending: true });
        try {
            const res = await backend.post("transaction-processing/final/report", data);
            if (res.status === 200) {
                set({ finalReport: res.data, loading: false, sending: false });
            }
        } catch (err) {
            set({ error: err, loading: false, sending: false });
        }
    },

    removeRecord: async (id) => {
        set({ removed: false });
        try {
            const res = await backend.delete(`transaction-processing/${id}`);
            if (res.status === 200) {
                set({ message: res.data.message, removed: true });
            } else {
                set({ message: res.data.error, error: true, removed: false });
            }
        } catch (error) {
            console.log(error);
        }
    },

    resetProperty: (key, value) => set({ [key]: value }),

    filterProperty: (option, data) => {
        if (option === "All") {
            set({ option, startDate: "", endDate: "" });
        } else if (option === "Filter") {
            set({
                option,
                startDate: moment(data[0]).format("DD-MM-YYYY"),
                endDate: moment(data[1]).format("DD-MM-YYYY"),
            });
        }
    },

    stats: () => get().reconcillations.length || 0,

    pendingPristines: () => {
        const { reconcillations, option, startDate, endDate } = get();
        return reconcillations.filter((d) => {
            const date = moment(d.created_at);
            if (option === "All") {
                return !d.approved_one;
            }
            if (option === "Filter" && date.isBetween(moment(startDate), moment(endDate), null, "[]")) {
                return !d.approved_one;
            }
            return false;
        });
    },

    pendingFinales: () => {
        const { reconcillations, option, startDate, endDate } = get();
        return reconcillations.filter((d) => {
            const date = moment(d.reconcile_date_one);
            if (option === "All") {
                return d.approved_one && !d.approved_two;
            }
            if (option === "Filter" && date.isBetween(moment(startDate), moment(endDate), null, "[]")) {
                return d.approved_one && !d.approved_two;
            }
            return false;
        });
    },

    completed: () => {
        const { reconcillations, option, startDate, endDate } = get();
        return reconcillations.filter((d) => {
            const date = moment(d.reconcile_date_two);
            if (option === "All") {
                return d.approved_one && d.approved_two;
            }
            if (option === "Filter" && date.isBetween(moment(startDate), moment(endDate), null, "[]")) {
                return d.approved_one && d.approved_two;
            }
            return false;
        });
    },

    overduePristines: () => {
        const { reconcillations } = get();
        return reconcillations.filter((d) => {
            const date = moment(d.created_at);
            return !d.approved_one && moment().diff(date, "days") >= 30;
        }).length;
    },

    overdueFinales: () => {
        const { reconcillations } = get();
        return reconcillations.filter((d) => {
            const date = moment(d.created_at);
            return d.approved_one && !d.approved_two && moment().diff(date, "days") >= 30;
        }).length;
    },

    overdue: () => {
        return [get().overduePristines(), get().overdueFinales()];
    },
}));

export default useReconStore;
